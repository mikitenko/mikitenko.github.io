angular.module('Store')
    .filter('protuctFilter', function () {
        return function (arr, searchString) {
            if (!searchString) {
                return arr;
            }

            var result = [];

            searchString = searchString.toLowerCase();

            angular.forEach(arr, function (productObj) {
                if (productObj.name.toLowerCase().indexOf(searchString) !== -1) {
                    result.push(productObj);
                }

            });

            return result;
        };

    });
