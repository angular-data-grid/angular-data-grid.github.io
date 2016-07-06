(function () {
    'use strict';

    angular
        .module('myApp', ['ui.bootstrap', 'dataGrid', 'pagination', 'angular-loading-bar'])
        .controller('myAppController', MyAppController)
        .factory('myAppFactory', MyAppFactory);

    MyAppController.$inject = ['$scope', 'myAppFactory'];
    MyAppFactory.$inject = ['$http'];

    function MyAppController($scope, myAppFactory) {

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
        myAppFactory.getStatuses().success(function (resp) {
            $scope.UI.statusOptions = resp;
        });
    }

    function MyAppFactory($http) {
        var herokuDomain = 'https://server-pagination.herokuapp.com';
        return {
            getOrdersData: getOrdersData,
            getStatuses: getStatuses
        };

        function getOrdersData(params, callback) {
            $http.get(herokuDomain + '/orders' + params).success(function (response) {
                callback(response.orders, response.ordersCount);
            });
        }

        function getStatuses() {
            return $http.get(herokuDomain + '/orders/statuses');
        }
    }
})();
