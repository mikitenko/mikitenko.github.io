var app = angular.module('GalleryApp', ['ngRoute']);

app.config(function ($routeProvider) {
    debugger;
    $routeProvider
        .when('/', {
            controller: "HomeController",
            templateUrl: "views/home.html"
        })
        .when('/photos/:id', {
            controller: 'PhotoController',
            templateUrl: 'views/photo.html'
        })
        .otherwise({
            redirectTo: '/'
        });
});
