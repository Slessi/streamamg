(function () {
    'use strict';

    angular
        .module('amg')
        .filter('time', TimeFilter);

    TimeFilter.$inject = [];
    function TimeFilter() {
        return secondsToTime;

        function secondsToTime(input) {
            input = parseFloat(input) || 0;

            var hours = Math.floor(input / 3600);
            var minutes = Math.floor((input - (hours * 3600)) / 60);
            var seconds = Math.floor(input - (hours * 3600) - (minutes * 60));

            var output = lpad(minutes) + ':' + lpad(seconds);

            if (hours > 0) {
                output = lpad(hours) + ':' + output;
            }

            return output;

            function lpad(num) {
                if (num < 10) {
                    num = '0' + num;
                }

                return num;
            }
        }
    }
})();