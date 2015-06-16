angular.module('Store')
    .controller('CategoryController', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        var url = 'dataJSON/' + $routeParams.categoryName + '.json';

        $scope.categoryName = $routeParams.categoryName;

        $http({cache: true, method: 'GET', url: url})
            .success(function (data) {
                $scope.categoryData = data;
            });

        $scope.colorSwatcher = function(event, index, product){




            debugger;
            var targetElem = $(event.currentTarget);

            if(!(targetElem.hasClass('active'))){
                targetElem.parent('ul').find('li').removeClass('active');
                targetElem.addClass('active');
                product.img = product.img.replace(/_(\d*)_/, '_' + product.swatchPrice[index].key + '_');
                //product.pdpPrice = product.dataPdp.swatchPrice[index].val;
            }
        }

    }]);


