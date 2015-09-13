app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'TTController'
      })
      .when('/:id/show', {
        templateUrl: 'views/show.html',
        controller: 'DashController'
      })
      .otherwise ({
        redirectTo: '/'
      })
});
