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
app.controller("CalendarController", ['$scope', '$routeParams', 'Trip', 'UserTrip', 'calendarservice', function($scope, $routeParams, Trip, UserTrip, calendarservice){
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
  console.log($scope);
  // $scope.userId = $routeParams.id;

  // $scope.trip = Trip.get(function({id: $routeParams.id}) {
  //   console.log('single trip', $scope.trip);
  // });

  // updates a previous trip, adds a new trip
  $scope.renewTrip = function (trip, day) {
    var tripObj = {}
    for (key in trip) {
       tripObj.day_part = key
    }
    tripObj.userId = parseInt($routeParams.id)
    tripObj.date = (month + 1) + "/" + day + "/" + year;
    tripObj.type = trip[tripObj.day_part]
    tripObj.dw_distance = ""
    UserTrip.query({ id: 495653}, function(data) {
      tripObj.distance = data[0].distance
      tripObj.school = data[0].school;
      console.log("trip to go into database: ", tripObj);

      function filterByDateTime(obj) {
        if (obj.date === tripObj.date && obj.day_part === tripObj.day_part) {
          return true;
        } else {
          return false;
        }
      }

      // check UserTrips to see if trip at day/time already exists
      if (data.filter(filterByDateTime).length > 0) {
        console.log('found, go to update');
      } else {
        console.log('not found, new trip');
        var trip = new Trip;
        trip = tripObj
        Trip.save(trip, function () {
          console.log("trip saved to db: ", trip);
        })
      }
    })
  }

  $scope.deleteTrip = function () {
    Trip.delete({ id: $scope.trip._id })
  }

  $scope.updateTrip = function (trip) {
    $scope.trip = Trip.get({ id: $scope.trip._id }, function() {
      // $scope.trip is fetched from server and is an instance of Trip
      $scope.trip = '{something else in the object}';
      $scope.trip.$update(function() {
        //updated in the backend
      });
    });
  }

}])
