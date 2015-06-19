angular.module('Store', ['ngRoute', 'ngSanitize']) //create ng app and connect ngRouter lib
    /*.run(['$rootScope',function($rootScope) { //add to $root scope object
        $rootScope.data = {data:'data'};     // $scope.$root ?? ????? ????????? ? ????? ?????? ???????????, ?????? ??? $root ? ????????? ??
    }])*/
    //ngRoute module for router
    //ngSanitize module for work html template "ng-bind-html"
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: './templates/home/index.html'
            })
            .when('/category/:categoryName', {
                templateUrl: './templates/category/index.html',
                controller: 'CategoryController'
            })
            .when('/productdetail/:categoryName/:productId', {
                templateUrl: './templates/productdetail/index.html',
                controller: 'ProductDetailController'
            })
            .otherwise({redirectTo: '/'});
    }]);
