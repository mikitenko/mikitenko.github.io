app.controller('MainController', function($scope) {
    $scope.title = 'This Month\'s Bestsellers';
    $scope.promo = 'The most popular books this month.';
    $scope.products = [
        {
            name: 'The Book of Trees',
            price: 19,
            pubdate: new Date('2014', '03', '08'),
            cover: './img/cover_640.jpg',
            likes: 0,
            dislikes: 0
        },
        {
            name: 'Program or be Programmed',
            price: 8,
            pubdate: new Date('2013', '08', '01'),
            cover: './img/program.jpg',
            likes: 0,
            dislikes: 0
        },
        {
            name: 'Harry Potter & The Prisoner of Azkaban',
            price: 11.99,
            pubdate: new Date('1999', '07', '08'),
            cover: './img/Harry_Potter.jpg',
            likes: 0,
            dislikes: 0
        },
        {
            name: 'Ready Player One',
            price: 7.99,
            pubdate: new Date('2011', '08', '16'),
            cover: './img/Ready_Player_One.jpg',
            likes: 0,
            dislikes: 0
        }
    ];
    $scope.plusOne = function(i) {
        $scope.products[i].likes += 1;
    };
    $scope.minusOne = function(i) {
        $scope.products[i].dislikes += 1;
    };
});