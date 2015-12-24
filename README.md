# angular-data-grid.github.io
Light and flexible Data Grid for AngularJS applications.

You can use Data Grid module to easily display data in grids with built-in sorting, outer filters and url-synchronization. To use it, you must add grid-data directive to element and pass 2 required parameters grid-options and grid-actions.

grid-options : Name of object in your controller with start options for grid. You must create this object with at least 1 required parameter - data

grid-actions: Name of object in your controller with functions for updating grid. You can can just pass string or create empty object in controller. Use this object for calling methods of directive: sort, filter, refresh.

Inside the grid-data directive you can use grid-pagination directive. It's just wrapper of angular-ui pagination directive. You can pass any parameters from pagination directive. Also you can use grid-item-per-page directive and pass into it array of value (f.e. "10, 25, 50"). If you need get size of current displayed items you can use filtered variable.

#Sorting:
You can use the sortable directive to have a built in sort feature. You add the attribute sortable to your table headers. This will specify the property name you want to sort by. Also if you add class sortable to your element, sort arrows will be displayed for acs/decs sort directions.

#Filters:
Data Grid module has 4 types built in filters. To use it, you must add attribute filter-by to any element and pass property name, which you want filtering. Also you need add attribute filter-type with type of filter (text, select, dateFrom, dateTo). After that you need call filter() method in ng-change for text or select inputs and in ng-blur/ng-focus for datepickers. Filters synchronize with URL by ng-model value.

#Custom Filters:
If you need use some custom filters (f.e. filter by first letter), you must add filter-by to specify property name, which you want filtering and add ng-model property. Then create in gridOptions.customFilters variable named as it ng-model value and contain filtering function. Filtering function accept items, value, predicate arguments and must return filtered array.

#Others:
All filters has parameter disable-url. If you set it as true value - URL-synchronization for this filter will be disabled. If you need use 2 or more grids on page, you must add id to grids, and use grid-id attribute on filters to specify their grid.
