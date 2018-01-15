module.exports = {
    Now: {
        getDate: function () {
            var date = new Date();
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        getWeek: function () {
            var date = new Date();
            switch (date.getDay()) {
                case 0:
                    return '星期天';
                case 1:
                    return '星期一';
                case 2:
                    return '星期二';
                case 3:
                    return '星期三';
                case 4:
                    return '星期四';
                case 5:
                    return '星期五';
                case 6:
                    return '星期六';
            }
        },
        getTime: function () {
            var date = new Date();
            return (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        },
        getFull: function () {
            var date = new Date();
            return date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' + (date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate());
        },
        getTimespan: function (time) {
            var tarTime = new Date(time);
            var now = new Date();
            var span = now.getTime() - tarTime.getTime();

            var days = Math.floor(span / (24 * 3600 * 1000));
            if (days > 0)
                return days + " 天";
            var leave1 = span % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000));
            if (hours > 0)
                return hours + " 小时";
            var leave2 = leave1 % (3600 * 1000);    //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000));
            if (minutes > 0)
                return minutes + " 分钟";
            var leave3 = leave2 % (60 * 1000);    //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            if (seconds > 0)
                return seconds + " 秒";
        }
    }
};