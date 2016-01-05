(function () {
    'use strict';

    angular
        .module('paging', [])
        .factory('paging', ['$parse', function ($parse) {
            return {
                create: function (ctrl, $scope, $attrs) {
                    ctrl.setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;
                    ctrl.ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl

                    ctrl.init = function (ngModelCtrl, config) {
                        ctrl.ngModelCtrl = ngModelCtrl;
                        ctrl.config = config;

                        ngModelCtrl.$render = function () {
                            ctrl.render();
                        };

                        if ($attrs.itemsPerPage) {
                            $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
                                ctrl.itemsPerPage = parseInt(value, 10);
                                $scope.totalPages = ctrl.calculateTotalPages();
                                ctrl.updatePage();
                            });
                        } else {
                            ctrl.itemsPerPage = config.itemsPerPage;
                        }

                        $scope.$watch('totalItems', function (newTotal, oldTotal) {
                            if (angular.isDefined(newTotal) || newTotal !== oldTotal) {
                                $scope.totalPages = ctrl.calculateTotalPages();
                                ctrl.updatePage();
                            }
                        });
                    };

                    ctrl.calculateTotalPages = function () {
                        var totalPages = ctrl.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / ctrl.itemsPerPage);
                        return Math.max(totalPages || 0, 1);
                    };

                    ctrl.render = function () {
                        $scope.page = parseInt(ctrl.ngModelCtrl.$viewValue, 10) || 1;
                    };

                    $scope.selectPage = function (page, evt) {
                        if (evt) {
                            evt.preventDefault();
                        }

                        var clickAllowed = !$scope.ngDisabled || !evt;
                        if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
                            if (evt && evt.target) {
                                evt.target.blur();
                            }
                            ctrl.ngModelCtrl.$setViewValue(page);
                            ctrl.ngModelCtrl.$render();
                        }
                    };

                    $scope.getText = function (key) {
                        return $scope[key + 'Text'] || ctrl.config[key + 'Text'];
                    };

                    $scope.noPrevious = function () {
                        return $scope.page === 1;
                    };

                    $scope.noNext = function () {
                        return $scope.page === $scope.totalPages;
                    };

                    ctrl.updatePage = function () {
                        ctrl.setNumPages($scope.$parent, $scope.totalPages); // Readonly variable

                        if ($scope.page > $scope.totalPages) {
                            $scope.selectPage($scope.totalPages);
                        } else {
                            ctrl.ngModelCtrl.$render();
                        }
                    };
                }
            };
        }]);

    angular
        .module('pagination', ['paging'])
        .controller('PaginationController', ['$scope', '$attrs', '$parse', 'paging', 'paginationConfig', function ($scope, $attrs, $parse, paging, paginationConfig) {
            var ctrl = this;
            // Setup configuration parameters
            var maxSize = angular.isDefined($attrs.maxSize) ? $scope.$parent.$eval($attrs.maxSize) : paginationConfig.maxSize,
                rotate = angular.isDefined($attrs.rotate) ? $scope.$parent.$eval($attrs.rotate) : paginationConfig.rotate,
                forceEllipses = angular.isDefined($attrs.forceEllipses) ? $scope.$parent.$eval($attrs.forceEllipses) : paginationConfig.forceEllipses,
                boundaryLinkNumbers = angular.isDefined($attrs.boundaryLinkNumbers) ? $scope.$parent.$eval($attrs.boundaryLinkNumbers) : paginationConfig.boundaryLinkNumbers;
            $scope.boundaryLinks = angular.isDefined($attrs.boundaryLinks) ? $scope.$parent.$eval($attrs.boundaryLinks) : paginationConfig.boundaryLinks;
            $scope.directionLinks = angular.isDefined($attrs.directionLinks) ? $scope.$parent.$eval($attrs.directionLinks) : paginationConfig.directionLinks;

            paging.create(this, $scope, $attrs);

            if ($attrs.maxSize) {
                $scope.$parent.$watch($parse($attrs.maxSize), function (value) {
                    maxSize = parseInt(value, 10);
                    ctrl.render();
                });
            }

            // Create page object used in template
            function makePage(number, text, isActive) {
                return {
                    number: number,
                    text: text,
                    active: isActive
                };
            }

            function getPages(currentPage, totalPages) {
                var pages = [];

                // Default page limits
                var startPage = 1, endPage = totalPages;
                var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

                // recompute if maxSize
                if (isMaxSized) {
                    if (rotate) {
                        // Current page is displayed in the middle of the visible ones
                        startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
                        endPage = startPage + maxSize - 1;

                        // Adjust if limit is exceeded
                        if (endPage > totalPages) {
                            endPage = totalPages;
                            startPage = endPage - maxSize + 1;
                        }
                    } else {
                        // Visible pages are paginated with maxSize
                        startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1;

                        // Adjust last page if limit is exceeded
                        endPage = Math.min(startPage + maxSize - 1, totalPages);
                    }
                }

                // Add page number links
                for (var number = startPage; number <= endPage; number++) {
                    var page = makePage(number, number, number === currentPage);
                    pages.push(page);
                }

                // Add links to move between page sets
                if (isMaxSized && maxSize > 0 && (!rotate || forceEllipses || boundaryLinkNumbers)) {
                    if (startPage > 1) {
                        if (!boundaryLinkNumbers || startPage > 3) { //need ellipsis for all options unless range is too close to beginning
                            var previousPageSet = makePage(startPage - 1, '...', false);
                            pages.unshift(previousPageSet);
                        }
                        if (boundaryLinkNumbers) {
                            if (startPage === 3) { //need to replace ellipsis when the buttons would be sequential
                                var secondPageLink = makePage(2, '2', false);
                                pages.unshift(secondPageLink);
                            }
                            //add the first page
                            var firstPageLink = makePage(1, '1', false);
                            pages.unshift(firstPageLink);
                        }
                    }

                    if (endPage < totalPages) {
                        if (!boundaryLinkNumbers || endPage < totalPages - 2) { //need ellipsis for all options unless range is too close to end
                            var nextPageSet = makePage(endPage + 1, '...', false);
                            pages.push(nextPageSet);
                        }
                        if (boundaryLinkNumbers) {
                            if (endPage === totalPages - 2) { //need to replace ellipsis when the buttons would be sequential
                                var secondToLastPageLink = makePage(totalPages - 1, totalPages - 1, false);
                                pages.push(secondToLastPageLink);
                            }
                            //add the last page
                            var lastPageLink = makePage(totalPages, totalPages, false);
                            pages.push(lastPageLink);
                        }
                    }
                }
                return pages;
            }

            var originalRender = this.render;
            this.render = function () {
                originalRender();
                if ($scope.page > 0 && $scope.page <= $scope.totalPages) {
                    $scope.pages = getPages($scope.page, $scope.totalPages);
                }
            };
        }])

        .constant('paginationConfig', {
            itemsPerPage: 10,
            boundaryLinks: false,
            boundaryLinkNumbers: false,
            directionLinks: true,
            firstText: 'First',
            previousText: 'Previous',
            nextText: 'Next',
            lastText: 'Last',
            rotate: true,
            forceEllipses: false
        })

        .directive('gridPagination', ['$parse', 'paginationConfig', function ($parse, paginationConfig) {
            return {
                scope: {
                    totalItems: '=',
                    firstText: '@',
                    previousText: '@',
                    nextText: '@',
                    lastText: '@',
                    ngDisabled: '='
                },
                require: ['gridPagination', '?ngModel'],
                controller: 'PaginationController',
                controllerAs: 'pagination',
                templateUrl: function (element, attrs) {
                    return attrs.templateUrl || 'src/template/pagination/pagination.html';
                },
                replace: true,
                link: function (scope, element, attrs, ctrls) {
                    var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                    if (!ngModelCtrl) {
                        return; // do nothing if no ng-model
                    }

                    paginationCtrl.init(ngModelCtrl, paginationConfig);
                }
            };
        }])

        .run(['$templateCache', function ($templateCache) {
            $templateCache.put('src/template/pagination/pagination.html',
                "<ul class='pagination'><li ng-if='::boundaryLinks' ng-class='{disabled: noPrevious()||ngDisabled}' class='pagination-first'><a href ng-click='selectPage(1, $event)'>{{::getText('first')}}</a></li> <li ng-if='::directionLinks' ng-class='{disabled: noPrevious()||ngDisabled}' class='pagination-prev'><a href ng-click='selectPage(page - 1, $event)'>{{::getText('previous')}}</a></li> <li ng-repeat='page in pages track by $index' ng-class='{active: page.active,disabled: ngDisabled&&!page.active}' class='pagination-page'><a href ng-click='selectPage(page.number, $event)'>{{page.text}}</a></li> <li ng-if='::directionLinks' ng-class='{disabled: noNext()||ngDisabled}' class='pagination-next'><a href ng-click='selectPage(page + 1, $event)'>{{::getText('next')}}</a></li> <li ng-if='::boundaryLinks' ng-class='{disabled: noNext()||ngDisabled}' class='pagination-last'><a href ng-click='selectPage(totalPages, $event)'>{{::getText('last')}}</a></li> </ul>"
            );
        }]);

})();