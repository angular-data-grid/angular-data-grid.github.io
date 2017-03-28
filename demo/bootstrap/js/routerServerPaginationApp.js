(function () {
    'use strict';

    angular
        .module('myApp', ['ui.bootstrap', 'dataGrid', 'pagination', 'ui.router', 'angular-loading-bar'])
        .config(config)
        .factory('myAppFactory', MyAppFactory);

    config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
    MyAppController.$inject = ['$scope', 'myAppFactory', '$state'];
    MyAppFactory.$inject = ['$http'];


    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/orders');

        $stateProvider
            .state('orders', {
                url: '/orders',
                templateUrl: 'views/router-server-pagination.html',
                controller: MyAppController
            })
            .state('anotherView', {
                url: '/anotherView',
                templateUrl: 'views/anotherView.html',
                controller: MyAppController
            })
    }

    function MyAppController($scope, myAppFactory, $state) {

        $scope.gridOptions = {
            data: [],
            getData: myAppFactory.getOrdersData,
            sort: {
                predicate: 'orderNo',
                direction: 'asc'
            }
        };
        $scope.UI = {};
        $scope.gridActions = {};
        $scope.goToAnotherState = function() {
            $state.go('anotherView');
        };
        $scope.back = function() {
            $state.go('orders');
        };
        myAppFactory.getStatuses().then(function (resp) {
            $scope.UI.statusOptions = resp.data;
        })
    }

    function MyAppFactory($http) {
        var herokuDomain = 'https://server-pagination.herokuapp.com';
        return {
            getOrdersData: getOrdersData,
            getStatuses: getStatuses
        };

        function getOrdersData(params, callback) {
            $http.get(herokuDomain + '/orders' + params).then(function (response) {
                callback(response.data.orders, response.data.ordersCount);
            });
        }

        function getStatuses() {
            return $http.get(herokuDomain + '/orders/statuses');
        }
    }
})();
