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
  $scope.userTrips = UserTrip.query({id: parseInt($routeParams.id)}, function(){

  // iterate over days
  // populate an object that has am / pm keys that are filled in with db data
  // bind to these am / pm objects
  // combine data from the database into this day object
  // remember to maintain this am/pm object
    $scope.days.forEach(function (day) {
      var date = (month + 1) + "/" + day.value + "/" + year
      console.log('date', date);
      $scope.userTrips.forEach(function(trip) {
        day.date = date
        if (date === trip.date){
          //build day opbject
          console.log('found it!', day);
          console.log('found it!', trip);
          if (trip.day_part === 'am') {
            day.am = trip.type;
            day.am_dw_distance = trip.dw_distance;
            console.log('build day.am', day);
          }
          if (trip.day_part === 'pm') {
            day.pm = trip.type;
            day.pm_dw_distance = trip.dw_distance;
            console.log('build day.pm', day);
          }
        }
        else {
          if (!day.am || !day.pm){
            day.am = 'none';
            day.pm = 'none';
          }
        }
      })
    })
  })



  // $scope.userId = $routeParams.id;

  // $scope.trip = Trip.get(function({id: $routeParams.id}) {
  //   console.log('single trip', $scope.trip);
  // });

  // either updates a previous trip or adds a new trip
  // TODO: (maybe) - don't worry about whether it's new or not - just send day / type etc...
  // on the server, find the records by day / user (as opposed to ID)
  // and have logic to always just do the right thing
  $scope.renewTrip = function (day) {
    // var tripObj = {} //build trip object
    console.log(day)
    console.log($scope)
    $scope.userTrips = UserTrip.query({id: parseInt($routeParams.id)}, function(){
      console.log($scope.userTrips);
      $scope.studentPowerDistance = dataservice.studentPowerDistance($scope.userTrips)
      console.log("number of trips", $scope.userTrips.length);
      $scope.reward = dataservice.calculateReward($scope.userTrips)
      // use moment in a service to calculate streaking
      // use moment in s service to calculate current active period
    })
    // for (key in trip) {
    //   if (key === 'am') {
    //    tripObj.day_part = 'am'
    //   }
    //   if (key === 'pm') {
    //     tripObj.day_part = 'pm'
    //   }
    //   if (key === 'dw_distance') {
    //     tripObj.dw_distance = trip[dw_distance]
    //   }
    // }
    // tripObj.userId = parseInt($routeParams.id)
    // tripObj.date = (month + 1) + "/" + day + "/" + year;
    // tripObj.type = trip[tripObj.day_part]
    // UserTrip.query({ id: $routeParams.id}, function(data) {
    //   tripObj.distance = data[0].distance
    //   tripObj.school = data[0].school;
    //   console.log("trip to go into database: ", tripObj);
    //
    //   function filterByDateTime(obj) {
    //     if (obj.date === tripObj.date && obj.day_part === tripObj.day_part) {
    //       return true;
    //     } else {
    //       return false;
    //     }
    //   }
    //
    //   var updateObj = data.filter(filterByDateTime)
    //   // check UserTrips to see if trip at day/time already exists
    //   if (updateObj.length > 0) {
    //     console.log('entry to update', updateObj[0]._id);
    //     console.log('found, go to update');
    //     // $scope.updateTrip(updateObj[0]._id, tripObj)
    //   } else {
    //     console.log('not found, new trip');
    //     // $scope.newTrip(tripObj)
    //   }
    // })
    // $scope.trip = {}//reinitialize for next click
  }

  $scope.newTrip = function (tripObj) {
    var trip = new Trip();
    trip = tripObj
    Trip.save(trip, function () {
      console.log("trip saved to db: ", trip);
    })
  }

  $scope.deleteTrip = function (trip) {
    Trip.delete({ id: $scope.trip._id })
  }

  $scope.updateTrip = function (_id, tripObj) {
    var trip = Trip.get({ id: _id }, function() {
      // $scope.trip is fetched from server and is an instance of Trip
      console.log('trip to update from server', trip);
      console.log('new trip info to add', tripObj);
      trip.type = tripObj.type;
      trip.dw_distance = tripObj.dw_distance;
      trip.$update(function() {
        console.log('trip updated');
      });
    });
  }

}])
