(function () {
    'use strict';

    angular
        .module('myApp', ['ui.bootstrap', 'dataGrid', 'pagination'])
        .controller('myAppController', MyAppController)
        .factory('myAppFactory', MyAppFactory);

    MyAppController.$inject = ['$scope', 'myAppFactory'];
    MyAppFactory.$inject = ['$http'];

    function MyAppController($scope, myAppFactory) {

        $scope.gridOptions = {
            data: [],
            getData: myAppFactory.getOrdersData,
            sort: {
                predicate: 'name',
                direction: 'asc'
            }
        };
        $scope.gridActions = {};
    }

    function MyAppFactory($http) {
        var herokuDomain = 'https://server-pagination.herokuapp.com';
        return {
            getOrdersData: getOrdersData
        };

        function getOrdersData(params, callback) {
            $http.get(herokuDomain + '/orders' + params).success(function (response) {
                callback(response.orders, response.ordersCount);
            });
        }
    }
})();
