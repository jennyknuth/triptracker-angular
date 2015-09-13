app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'TTController'
      })
      .when('/:id', {
        templateUrl: 'views/show.html',
        controller: 'UserController'
      })
      .otherwise ({
        redirectTo: '/'
      })
});
