app.controller("HomeController", ['$scope', '$route', 'User', 'Trip', 'dataservice', function($scope, $route, User, Trip, dataservice){
  console.log('hello from HomeController');

  // get all users
  $scope.users = User.query( function (){
    console.log('all users:', $scope.users);
  });

  // get all trips
  $scope.trips = Trip.query( function () { //get data for home/splash page here!
    console.log('all trips:', $scope.trips);
    $scope.totalDistance = dataservice.totalDistance($scope.trips)
    $scope.data = [
      {name: $scope.trips[0].userId, score: $scope.trips[0].distance},
      {name: $scope.trips[55543].userId, score: $scope.trips[55543].distance},
      {name: $scope.trips[5543].userId, score: $scope.trips[5543].distance},
      {name: $scope.trips[543].userId, score: $scope.trips[543].distance}
    ];
  })

  $scope.newUser = function () {
    $scope.user.type = 'parent'
    console.log('new user to go into API and database', $scope.user);
    User.save($scope.user, function() {
      //data saved. do something here.
      console.log('trip.save here');
      $route.reload()
    }); //saves an entry. Assuming $scope.trip is the Trip object
  }


  $scope.showDetailPanel = function(item) { //example of on-click function
    $scope.$apply(function() {
      if (!$scope.showDetailPanel)
        $scope.showDetailPanel = true;
      $scope.detailItem = item;
    });
  };
  // $scope.userId = 495653;
  // $scope.userId = 431094; //this will come from where? firebase?

}])

app.controller("StudentController", ['$scope', '$routeParams', 'UserTrip', 'User', 'dataservice', function($scope, $routeParams, UserTrip, User, dataservice){
  console.log("hello from StudentController");
  console.log($routeParams.id);
  // $scope.user.userId = $routeParams.id;

  // $scope.trip = Trip.get(function({id: $routeParams.id}) {
  //   console.log('single trip', $scope.trip);
  // });
  $scope.user = User.get({id: parseInt($routeParams.id)}, function (){
    console.log('user?', $scope.user);
  })

  $scope.userTrips = UserTrip.query({id: parseInt($routeParams.id)}, function(){
    console.log($scope.userTrips);
    $scope.studentPowerDistance = dataservice.studentPowerDistance($scope.userTrips)
    console.log("number of trips", $scope.userTrips.length);
    $scope.reward = dataservice.calculateReward($scope.userTrips)
    // use moment in a service to calculate streaking
    // use moment in s service to calculate current active period
  })

}])

app.controller("ParentController", ['$scope', '$routeParams', 'Trip', 'User', 'dataservice', function($scope, $routeParams, Trip, User, dataservice){
  console.log("hello from ParentController");
  // $scope.userId = $routeParams.id;
  console.log($routeParams.id);
  User.query({id: $routeParams.id}, function (data) {
    $scope.students = data
  })
  $scope.newUser = function () {
    $scope.user.type = 'student'
    $scope.user.parent = $routeParams.id;
    console.log('new user to go into API and database', $scope.user);
    User.save($scope.user, function() {
      //data saved. do something here.
      console.log('trip.save here');
      $route.reload()
    }); //saves an entry. Assuming $scope.trip is the Trip object
  }


}])
app.controller("CalendarController", ['$scope', '$routeParams', '$http', '$route', 'Trip', 'UserTrip', 'calendarservice', function($scope, $routeParams, $http, $route, Trip, UserTrip, calendarservice){
  console.log("hello from CalendarController");

  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date = new Date()
  var month = date.getMonth();
  var year = date.getFullYear();
  // var month = 0;
  // var year = 2014;

  $scope.days = calendarservice.getDays(month, year)

  $scope.year = year
  $scope.month = monthNames[month]
  $scope.maxTrips = calendarservice.maxTrips($scope.days)

  // BUILD CALENDAR from user's trips in database:
  $scope.userTrips = UserTrip.query({id: parseInt($routeParams.id)}, function(){
    // need to calculate user trips in current period with a service

    // iterate over days
    $scope.days.forEach(function (day) {
      var date = (month + 1) + "/" + day.value + "/" + year

      // Build day object from user trips
      // remember to maintain this day object
      $scope.userTrips.forEach(function(trip) {
        calendarservice.buildDayObj(day, trip, date)
      })
    })
      console.log($scope);
  })

  $scope.setColor = function (type) {


    var colorMap = {
      // "none": "lightgray",
      "rtd": "rgba(198,40,40, .5)",
      "carpool": "rgba( 213, 0, 249, .5)",
      "school bus": "rgba(255,193,7, .5)",
      "drive/walk": "rgba(101,31,255, .5)",
      "walk": "rgba(21,101,192, .5)",
      "bike": "rgba(0,121,107, .5)",
      "skate/scoot": "rgba(239,108,0, .5)"
    }

    console.log('color for morning', colorMap[type]);

    return {'background-color': colorMap[type]}

  }

  // option 1: send package to server, have server do logic if it is to create/edit/delete
  // option 2: none = need new, any other, modify
  //
  $scope.renewAmTrip = function (dayObj) {
    // console.log('day coming in to renew', dayObj);
    var amTrip = calendarservice.makeAmTrip(dayObj)
    // console.log('amTrip to post', amTrip);
    $http.post('http://localhost:8080/api/trips/user/' + dayObj.userId, amTrip)
    // console.log('day after post', dayObj);
  }
  $scope.renewPmTrip = function (day) {
    var pmTrip = calendarservice.makePmTrip(day)
    // console.log('pmTrip to post', pmTrip);
    $http.post('http://localhost:8080/api/trips/user/' + day.userId, pmTrip)
  }

  $scope.deleteTrip = function (id) {
    Trip.delete({ id: id })
  }

  // $scope.newTrip = function (tripObj) {
  //   var trip = new Trip();
  //   trip = tripObj
  //   Trip.save(trip, function () {
  //     console.log("trip saved to db: ", trip);
  //   })
  // }

  // $scope.updateTrip = function (_id, tripObj) {
  //   var trip = Trip.get({ id: _id }, function() {
  //     // $scope.trip is fetched from server and is an instance of Trip
  //     console.log('trip to update from server', trip);
  //     console.log('new trip info to add', tripObj);
  //     trip.type = tripObj.type;
  //     trip.dw_distance = tripObj.dw_distance;
  //     trip.$update(function() {
  //       console.log('trip updated');
  //     });
  //   });
  // }

}])
