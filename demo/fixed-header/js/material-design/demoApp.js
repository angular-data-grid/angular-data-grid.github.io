angular.module('myApp', ['dataGrid', 'pagination', 'ngMaterial', 'dataGridUtils.fixedHeader'])
    .controller('myAppController', ['$scope', 'myAppFactory', function ($scope, myAppFactory) {

        $scope.gridOptions = {
            data: [],
            urlSync: true,
            pagination: {
                itemsPerPage: '75',
                currentPage: 1
            }
        };
        myAppFactory.getData().then(function (responseData) {
            $scope.gridOptions.data = responseData.data;
        });

    }])
    .factory('myAppFactory', function ($http) {
        return {
            getData: function () {
                return $http({
                    method: 'GET',
                    url: 'https://angular-data-grid.github.io/demo/data.json'
                });
            }
        }
    });

