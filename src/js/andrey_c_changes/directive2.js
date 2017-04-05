angular.module('myApp')
    .directive('fixedHeader2', ['$window', '$timeout', function ($window, $timeout) {
        var window = angular.element($window);

        return {
            restrict: 'A',            
            link: function (scope, element, attrs) {
                var elementOffsetFrom = attrs.offsetFromElementId ? 
                                        angular.element(document.querySelector('#' + attrs.offsetFromElementId))[0] : 
                                        window;
                
                function resizeFixed() {
                    var thElements = element.find("th");
                    for (var i = 0; i < thElements.length; i++) {
                        var tdElement = element.find("td").eq(i)[0];
                        if (!tdElement) {
                            return;
                        }
                        var tdElementWidth = tdElement.offsetWidth;
                        angular.element(thElements[i]).css({ 'width': tdElementWidth + 'px' });
                    }
                }

                function bindFixedToHeader() {
                    var thead = angular.element(element.find("thead")),
                        tbody = element.find("tbody");
                        tbodyLeftPos = tbody[0].getBoundingClientRect().left;
                    thead.addClass('fixed');
                    if (attrs.offsetFromElementId) {
                        var topElement = angular.element(document.querySelector(attrs.offsetFromElementId))[0];
                        var offset = topElement.getBoundingClientRect().top + topElement.offsetHeight;
                        angular.element(thead[0]).css({ "top": offset });
                    }                    
                    angular.element(thead[0]).css({"left": tbodyLeftPos});
                    tbody.addClass("tbody-offset");
                }

                function unBindFixedToHeader() {
                     var thead = angular.element(element.find("thead")),
                        tbody = element.find("tbody");
                    thead.removeClass('fixed');
                    angular.element(thead[0]).css({"left": ""});
                    angular.element(thead[0]).css({"top": ""});
                    tbody.removeClass("tbody-offset");
                }

                function scrollFixed() {
                    var offset = attrs.offsetFromElementId ? 
                                 elementOffsetFrom.getBoundingClientRect().top + elementOffsetFrom.offsetHeight : 
                                 $window.pageYOffset,
                    tableOffsetTop = attrs.offsetFromElementId ? 
                                     element[0].getBoundingClientRect().top : 
                                     element[0].getBoundingClientRect().top + offset,
                    tableOffsetBottom = tableOffsetTop + element[0].offsetHeight - element.find("thead")[0].offsetHeight;
                   
                    if(offset < tableOffsetTop || offset > tableOffsetBottom) {
                        unBindFixedToHeader();
                    }
                    else if(offset >= tableOffsetTop && offset <= tableOffsetBottom) {                        
                        bindFixedToHeader();
                    }
                    resizeFixed();
                }

                scope.$on('gridReloaded', function() {
                    $timeout(function(){
                        resizeFixed();
                        scrollFixed();
                    }, 0);
                });
                window.on('resize', resizeFixed);
                window.on('scroll', scrollFixed);
            }
        }
    }]);