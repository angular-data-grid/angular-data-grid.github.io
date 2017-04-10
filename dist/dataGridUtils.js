(function () {
    'use strict';
    angular.module('dataGridUtils', []);
})();
(function () {
    'use strict';
    angular.module('dataGridUtils.fixedHeader', [])
        .directive('fixedHeader', FixedHeader);

    FixedHeader.$inject = ['$window', '$timeout'];

    function FixedHeader($window, $timeout) {
        var window = angular.element($window);

        return {
            restrict: 'A',
            link: link
        };

        function link(scope, element, attrs) {
            var elementOffsetFrom = attrs.offsetFromElement ?
                document.querySelector(attrs.offsetFromElement) :
                window;

            function onResize() {
                var thElements = element.find("th");
                for (var i = 0; i < thElements.length; i++) {
                    var tdElement = element.find("td").eq(i)[0];
                    if (!tdElement) {
                        return;
                    }
                    var tdElementWidth = tdElement.offsetWidth;
                    angular.element(thElements[i]).css({'width': tdElementWidth + 'px'});
                }
            }

            function bindFixedToHeader() {
                var thead = element.find("thead"),
                    tbody = element.find("tbody"),
                    tbodyLeftPos = tbody[0].getBoundingClientRect().left;
                thead.addClass('fixed-header');
                if (attrs.offsetFromElement) {
                    var topElement = document.querySelector(attrs.offsetFromElement);
                    var offset = topElement.getBoundingClientRect().top + topElement.offsetHeight;
                    thead.css({"top": offset});
                }
                thead.css({"left": tbodyLeftPos});
                tbody.addClass("tbody-offset");
            }

            function unBindFixedToHeader() {
                var thead = element.find("thead"),
                    tbody = element.find("tbody");
                thead.removeClass('fixed-header');
                thead.css({"left": ""});
                thead.css({"top": ""});
                tbody.removeClass("tbody-offset");
            }

            function onScroll() {
                var offset = attrs.offsetFromElement ?
                        elementOffsetFrom.getBoundingClientRect().top + elementOffsetFrom.offsetHeight :
                        $window.pageYOffset,
                    tableOffsetTop = attrs.offsetFromElement ?
                        element[0].getBoundingClientRect().top :
                        element[0].getBoundingClientRect().top + offset,
                    tableOffsetBottom = tableOffsetTop + element[0].offsetHeight - element.find("thead")[0].offsetHeight;

                if (offset < tableOffsetTop || offset > tableOffsetBottom) {
                    unBindFixedToHeader();
                }
                else if (offset >= tableOffsetTop && offset <= tableOffsetBottom) {
                    bindFixedToHeader();
                }
                onResize();
            }

            scope.$on('gridReloaded', function () {
                $timeout(function () {
                    onResize();
                    onScroll();
                }, 0);
            });
            window.on('resize', onResize);
            window.on('scroll', onScroll);
        }
    }

})();