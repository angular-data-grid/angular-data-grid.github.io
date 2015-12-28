angular.module('myApp', ['dataGrid', 'pagination'])
    .controller('myAppController', ['$scope', 'myAppFactory', function ($scope, myAppFactory) {

        $scope.getData = function () {
            myAppFactory.getData()
                .success(function (response) {
                    $scope.gridOptions.data = response;
                    $scope.dataLoaded = true;
                }).error(function () {
            });
        };
        $scope.getData();

        $scope.gridOptions = {
            data: $scope.items,
            urlSync: true
        };

        //$scope.items = [
        //    {"firstName": "John", "lastName": "Doe"},
        //    {"firstName": "Anna", "lastName": "Smith"},
        //    {"firstName": "Peter", "lastName": "Jones"}
        //];


    }])
    .factory('myAppFactory', function ($http) {
        var root = 'http://jsonplaceholder.typicode.com';
        return {
            getData: function () {
                return $http.get(root + '/posts', {});
            }
        }
    });

