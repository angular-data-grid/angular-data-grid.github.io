angular.module('myApp', ['ui.bootstrap', 'dataGrid', 'pagination'])
    .controller('myAppController', ['$scope', 'myAppFactory', '$filter', function ($scope, myAppFactory, $filter) {

        $scope.gridOptions = {
            data: [],
            urlSync: true
        };

        myAppFactory.getData().then(function (responseData) {
            $scope.gridOptions.data = responseData.data;
        });

        $scope.exportToCsv = function (currentData) {
            var exportData = [];
            currentData.forEach(function (item) {
                exportData.push({
                    'Code': item.code,
                    'Date Placed': $filter('date')(item.placed, 'shortDate'),
                    'Status': item.statusDisplay,
                    'Total': item.total.formattedValue
                });
            });
            JSONToCSVConvertor(exportData, 'Export', true);
        }

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

