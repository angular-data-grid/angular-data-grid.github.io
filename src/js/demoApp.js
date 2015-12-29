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
            urlSync: false
        };

    }])
    .factory('myAppFactory', function ($http) {
        var root = 'http://jsonplaceholder.typicode.com';
        return {
            getData: function () {
                return $http.get(root + '/posts', {});
            }
        }
    });

