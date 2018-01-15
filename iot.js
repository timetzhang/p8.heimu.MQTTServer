/******
 *
 *  P8 MQTT 服务器
 *
 *  说明: 用来控制和管理IOT设备
 *  作者: T.T
 *  
 *  流程说明:(以下"someclientJohn"为客户端client-id示例)
 *  1. 某client-id为"someclientJohn"的客户端向服务器发送MQTT消息 [topic:control, payload:p8 404 light10 off]
 *     - 如需设备的feedback, 需要订阅主题: someclientJohn
 *     - feedback格式为: {"type": "BroadLC485", "feedback": "FDF7232412D3E2****" }
 *          - type说明: BroadLC485 / Simple / ...)
 *          - 请查阅相关type资料来解码feedback
 *  2. 服务器查找设备 "p8 404 light10" 并向其发送 off@client-id (如数据库中有off对应的command_code, 按数据库中的指令发送)
 *  3. 设备接收指令后，向服务器发送MQTT消息 [topic:someclientJohn, payload: ******]
 *     - 如客户端订阅了主题"someclientJohn", 就可以接收到feedback
 *
 *  MOSCA MQTT说明:
 *  绑定事件回调，mosca有下面几种事件，按需绑定。
 *
 *  clientConnected, 客户端已经连接，      参数：client；
 *  clientDisconnecting, 客户端正在断开连接， 参数：client；
 *  clientDisconnected, 客户端已经断开连接，  参数：client；
 *  published, 新消息发布，          参数：packet， client；
 *  subscribed, 客户端订阅信息，         参数：topic， client;
 *  unsubscribed, 客户端取消订阅信息，     参数：topic， client;
 *
 *  published事件单独拿出来说一下。packet包含了下面几个内容：
 *
 *  topic，主题
 *  payload，内容
 *  messageId
 *  qos
 *  retain
 *
 ******/
//Each Function Require
var $ = require('underscore');
//Time
var time = require('./common/time');
//汉字转拼音
var py = require('./common/ctopy.js');
//SQL连接
var dbDevice = require('./data/dbDevice');
var dbHeimu = require('./data/dbHeimu');
//MQTT服务设置
var mosca = require('mosca');
var mqtt = new mosca.Server({
    port: 1883
});
//HTTP Client
var httpClient = require('http');
//MQTT HTTP服务
var http = require('http');
var httpServer = http.createServer();
//WebSocket To MQTT
mqtt.attachHttpServer(httpServer);
httpServer.listen(9000);
//to save MQTT Clients
var clients = new Array();

//MQTT服务username与password验证
var authenticate = function (client, username, password, callback) {
    var authorized = (username === 'p8iot' && password.toString() === 'fd3sak2v6');
    if (authorized) client.user = username;
    callback(null, authorized);
}

/////////////////////////////////// 事件处理 /////////////////////////////////

mqtt.on('ready', function () {
    mqtt.authenticate = authenticate;
    console.log('mqtt is running at port 1883');
});

mqtt.on('clientConnected', function (client) {
    if (!clients.hasOwnProperty(client.id)) {
        clients[client.id] = client;
        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" connected');
    }
});

mqtt.on('clientDisconnected', function (client) {
    if (clients.hasOwnProperty(client.id)) {
        delete clients[client.id]
        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" disconnected');
    }
});

mqtt.on('published', function (packet, client) {
    switch (packet.topic) {
        /*
            获取语音文本回复(HEIMU AI)
            接收格式:
            {"text":"开5号灯", "location": {"building": "p8", "room": "404"}}
        */
        case 'talk heimu':
            if (packet.payload) {
                var dataReceived = JSON.parse(packet.payload.toString());
                console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" talk to heimu "' + JSON.stringify(dataReceived) + '"');
                if (dataReceived.text) {
                    dbHeimu.getHeimuSpeak(dataReceived.text, function (result) {
                        //使用本地语言库
                        if (result) {
                            var dataHeimu = JSON.parse(result);
                            switch (dataHeimu.type) {
                                case 'set device':
                                    for (var i = 0; i < dataHeimu.data.length; i++) {
                                        device.set(dataReceived.location.building, dataReceived.location.room, dataHeimu.data[i].device, dataHeimu.data[i].value, client);
                                    }
                                    break;
                                case 'speak':
                                    mqtt.publish({
                                        topic: client.id + ' talk heimu',
                                        payload: '{"type":"voice-text", "data": "' + dataHeimu.data[parseInt(Math.random() * dataHeimu.data.length)] + '"}'
                                    });
                            }
                        }
                        //使用远程语言库
                        else {
                            var options = {
                                host: 'www.tuling123.com',
                                port: 80,
                                path: '/openapi/api?key=98e83dafc5b0144484405bc7ecbcabdb&info=' + encodeURIComponent(dataReceived.text),
                                method: 'GET'
                            };
                            var req = httpClient.get(options, function (res) {
                                res.setEncoding('utf8');
                                res.on('data', function (chunk) {
                                    mqtt.publish({
                                        topic: client.id + ' talk heimu',
                                        payload: '{"type":"voice-text", "data": "' + JSON.parse(chunk).text + '"}'
                                    });
                                });
                            });
                            
                        }
                    });
                }
            }
            break;
        /*
        获取客户端列表
        topic: "get client"
        */
        case 'get client':
            var clientList = new Array();
            for (var key in clients) {
                clientList.push(key);
            }
            if (client) {
                mqtt.publish({ topic: client.id + ' get client', payload: '{"type":"clientlist", "data": ' + JSON.stringify(clientList) + '}' });
            }
            break;
        /*
        控制IOT设备
        set 接收到的data的处理方式
        [0] -- Building
        [1] -- Room
        [2] -- Device
        [3] -- Value
        */
        case 'set device':
            var data = packet.payload.toString().split(' ');
            if (data.length >= 4) {
                //通过builing, room, device查询设备的chip_id和command_code
                device.set(data[0], data[1], data[2], data[3], client);
            }
            break;

        default:
            console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] published topic "' + packet.topic.toString() + '" / message "' + packet.payload.toString() + '"');
    }
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

/////////////////////////////////// 公用方法 //////////////////////////////////
var device = {
    set: function (building, room, device, value, client) {
        dbDevice.getChipIdAndCommandCode(building, room, device, function (err, rows) {
            if (!err) {
                var command_code = JSON.parse(rows.command_code);
                var sendValue;
                if (command_code.hasOwnProperty(value)) {
                    sendValue = command_code[value];
                }
                else {
                    sendValue = value;
                }
                if (client) {
                    console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] client "' + client.id + '" control "' + device + '" to be "' + value + '"');
                    console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] server sending "' + sendValue + '" to "' + rows.name + '"');
                    if (clients.hasOwnProperty(rows.name)) {
                        //以chipname为topic发布消息
                        //消息内容为 message@client-id
                        //让Device可以通过client-id为主题来反馈消息
                        mqtt.publish({ topic: rows.name, payload: sendValue + '@' + client.id });
                        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] sent to "' + rows.name + '"');
                    }
                    else {
                        console.log('[' + time.Now.getFull() + ' ' + time.Now.getTime() + '] device "' + rows.name + '" is offline.');
                    }
                }
            }
            else {
                console.log(err);
            }
        });
    }
}
