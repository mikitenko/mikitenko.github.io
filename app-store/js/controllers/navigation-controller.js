angular.module('Store')
    .controller('NavigationController', ['$scope', '$location', function ($scope, $location) {
        $scope.navItems = [{
            name: "Accessories"
        },{
            name: "Blazers"
        },{
            name: "Footwear"
        },{
            name: "Jeans"
        },{
            name: "Outerwear"
        },{
            name: "Pants"
        },{
            name: "Shirts"
        },{
            name: "Shorts"
        },{
            name: "Sweaters"
        },{
            name: "Sweatshirts"
        },{
            name: "Swimwear"
        }];

        $scope.navClass = function (page) {
            var currentRoute = $location.path().substring(1).split('/')[1] || 'home';
            return currentRoute === page ? 'active' : '';
        };
    }]);
