(function () {
    'use strict';

    angular
        .module('amg')
        .config(config);

    config.$inject = ['$locationProvider']
    function config($locationProvider) {
        $locationProvider.html5Mode(true);
    }
})();