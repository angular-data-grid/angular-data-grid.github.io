(function () {
    'use strict';

    angular.module('myApp', ['ui.bootstrap', 'dataGrid', 'pagination'])
        .controller('myAppController', ['$scope', function ($scope) {

            $scope.gridOptions = {
                data: generateJSON(100000),
                urlSync: true
            };

        }]);

    function generateJSON(length) {
        var jsonObj = [],
            i,
            max,
            names = ['Ann', 'Ben', 'Patrick', 'Steve', 'Fillip', 'Bob'],
            item;
        for (i = 0, max = length; i < max; i++) {

            item = {};
            item.id = i;
            item.name = names[Math.round(Math.random() * (names.length - 1))];
            item.phone = '+375-29-' + Math.round(Math.random() * 1000000);
            item.date = Math.round(Math.random() * 1000000000000);
            jsonObj.push(item);

        }
        return jsonObj;
    }
})();


