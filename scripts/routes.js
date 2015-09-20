app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'TTController'
      })
      .when('/parent/:id', {
        templateUrl: 'views/parent.html',
        controller: 'ParentController'
      })
      .when('/:id', {
        templateUrl: 'views/show.html',
        controller: 'StudentController'
      })
      .when('/:id/edit', {
        templateUrl: 'views/edit.html',
        controller: 'CalendarController'
      })
      // .otherwise ({
      //   redirectTo: '/'
      // })
});
