app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeController'
      })
      .when('/styleguide', {
        templateUrl: 'views/styleguide.html'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .when('/FAQ', {
        templateUrl: 'views/FAQ.html'
      })
      .when('/parent/:id/new', {
        templateUrl: 'views/new.html',
        controller: 'NewController'
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
