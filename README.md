#Angular Data Grid

Light and flexible Data Grid for AngularJS, with built-in sorting, pagination and filtering options, unified API for client-side and server-side data fetching, 
seamless synchronization with browser address bar and total freedom in choosing mark-up and styling suitable for your application.

### Features 

 - Does not have any hard-coded template so you can choose any mark-up you need, from basic ```html <table>``` layout to any ```html <div>``` structure.
 - Easily switch between the most popular Bootstrap and Google Material theming, or apply your own CSS theme just by changing several CSS classes.
 - Built-in sync with browser address bar (URL), so you copy-n-paste sorting/filtering/pagination results URL and open it in other browser / send to anyone - even if pagination / filtering are done on a client-side. 
 - Unlike most part of other Angular DataGrids, we intentionally use non-isolated scope of the directive, so it can be easily synchronized with any data changes inside your controller. !With great power comes great responsibility, so be careful to use non-isolated API correctly.

## Setup

1. Include scripts in you application: dataGrid.min.js and pagination.min.js (include the second one only if you need pagination), like: 
 
 ```javascript
 <script src="components/angular-data-grid/pagination.min.js"></script>
 <script src="components/angular-data-grid/dataGrid.min.js"></script>
 ```
 
2. Inject dataGrid dependency in your module:

 ```javascript
angular.module('myApp', ['dataGrid', 'pagination'])
 ```
 
3. Initialize grid with additional options in your controller, like:

 ```javascript
 $scope.gridOptions = {
                data: [], //required parameter - array with data
                //optional parameter - start sort options
                sort: {
                    predicate: 'companyName',
                    direction: 'asc'
                },
                //optional parameter - custom rules for filters (see explanation below)
                customFilters: {
                    startFrom: function (items, value, predicate) {
                        return items.filter(function (item) {
                            return value && item[predicate] ? !item[predicate].toLowerCase().indexOf(value.toLowerCase()) : true;
                        });
                    }
                },
                //optional parameter - URL synchronization
                urlSync: true
                };
```
       
## Sorting
You can use the sortable directive to have a built in sort feature. You add the attribute sortable to your table headers. This will specify the property name you want to sort by. Also if you add class sortable to your element, sort arrows will be displayed for acs/decs sort directions.

You can use  Data Grid module to easily display data in grids with built-in sorting, outer filters and url-synchronization. To use it, you must add grid-data directive to element and pass 2 required parameters ```grid-options``` and ```grid-actions```.

```grid-options``` : Name of object in your controller with start options for grid. You must create this object with at least 1 required parameter - data.

```grid-actions```: Name of object in your controller with functions for updating grid. You can can just pass string or create empty object in controller. Use this object for calling methods of directive: sort, filter, refresh.

Inside the ```grid-data``` directive you can use grid-pagination directive. It's just wrapper of angular-ui pagination directive. You can pass any parameters from pagination directive. Also you can use grid-item-per-page directive and pass into it array of value (f.e. "10, 25, 50"). If you need get size of current displayed items you can use filtered variable.

##Filters:
Data Grid module has 4 types built in filters. To use it, you must add attribute filter-by to any element and pass property name, which you want filtering. Also you need add attribute filter-type with type of filter (text, select, dateFrom, dateTo). After that you need call filter() method in ng-change for text or select inputs and in ng-blur/ng-focus for datepickers. Filters synchronize with URL by ng-model value.

##Custom Filters:
If you need use some custom filters (f.e. filter by first letter), you must add filter-by to specify property name, which you want filtering and add ng-model property. Then create in gridOptions.customFilters variable named as it ng-model value and contain filtering function. Filtering function accept items, value, predicate arguments and must return filtered array.

##Others:
All filters has parameter disable-url. If you set it as true value - URL-synchronization for this filter will be disabled. If you need use 2 or more grids on page, you must add id to grids, and use grid-id attribute on filters to specify their grid.
