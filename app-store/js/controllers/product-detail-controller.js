angular.module('Store')
    .controller('ProductDetailController', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        var url = 'dataJSON/' + $routeParams.categoryName + '.json';

        $http({cache: true, method: 'GET', url: url})
            .success(function (data) {
                $scope.categoryData = data;

                for (var key in data[0].products) {
                    if (data[0].products[key].id == $routeParams.productId) {
                        $scope.dataPdp = data[0].products[key];

                        $scope.pdpPrice = $scope.dataPdp.swatchPrice[0].val;

                        $scope.pdpImg = $scope.dataPdp.img.replace(/_(\d*)_/, '_' + $scope.dataPdp.swatchPrice[0].key + '_');



                        window.pdp = $scope.dataPdp;
                    }
                }
            });





        $scope.colorSwatcher = function(event, index){


            var targetElem = $(event.currentTarget);

            if(!(targetElem.hasClass('active'))){
                targetElem.parent('ul').find('li').removeClass('active');
                targetElem.addClass('active');
                $scope.pdpImg = $scope.dataPdp.img.replace(/_(\d*)_/, '_' + $scope.dataPdp.swatchPrice[index].key + '_');
                $scope.pdpPrice = $scope.dataPdp.swatchPrice[index].val;
            }
        }

    }]);
