app.controller("HomeController", ['$scope', '$route', '$location', 'User', 'Trip', 'dataservice', function($scope, $route, $location, User, Trip, dataservice){
  console.log('hello from HomeController');
  $scope.parent = {}

  $scope.login = function () {
    $scope.parent.userId = 99;
    window.localStorage.setItem("userId", "99");
    $location.path('/#/parent/99');
  }

  $scope.parent.userId = window.localStorage.getItem("userId");

  // get all users
  $scope.users = User.query( function (){
    console.log('all users:', $scope.users);
  });

  // get all trips
  $scope.trips = Trip.query( function () { //get data for home/splash page here!
    console.log('all trips:', $scope.trips);
    $scope.totalDistance = dataservice.totalDistance($scope.trips)
    $scope.studentPowerDistance = dataservice.totalDistance($scope.trips)

    // var testTrips = []
    // for (var i = 0; i < 100; i++) {
    //   testTrips.push($scope.trips[i])
    // }
    // console.log(testTrips);
    $scope.monthData = []

    for (var i = 0; i < 12; i++) {
      var tripsArr = dataservice.getMonthTrips($scope.trips, i)
      if (tripsArr.length > 0) {
        var monthTripObj = dataservice.countTripTypes(tripsArr)
        monthTripObj.month = i
        $scope.monthData.push(monthTripObj)
      }
    }

  console.log($scope.monthData);
  })
  $scope.newUser = function (user) {
    console.log('new user!', user);
    var newUser = new User();
    newUser.userId = parseInt(user.userId);
    newUser.type = 'parent';
    $scope.parent = newUser;
    console.log('new user to go into API and database', newUser);
    User.save(newUser)
    //   , function() {
    //   //data saved. do something here.
    //   console.log('trip.save here');
    //   // $route.reload();
    // }); //saves an entry. Assuming $scope.trip is the Trip object
  }

  $scope.showDetailPanel = function(item) { //example of on-click function
    $scope.$apply(function() {
      if (!$scope.showDetailPanel)
        $scope.showDetailPanel = true;
      $scope.detailItem = item;
    });
  };

}])

app.controller("StudentController", ['$scope', '$routeParams', 'UserTrip', 'User', 'dataservice', function($scope, $routeParams, UserTrip, User, dataservice){
  console.log("hello from StudentController");
  console.log($routeParams.id);
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

app.controller("ParentController", ['$scope', '$routeParams', 'Trip', 'User', 'UserTrip', 'dataservice', function($scope, $routeParams, Trip, User, UserTrip, dataservice){
  console.log("hello from ParentController");
  console.log($routeParams.id);
  $scope.students = []
  var trips = [];
  $scope.parent = User.get({id: parseInt($routeParams.id)}, function (){
    console.log($scope.parent);
    $scope.parent.students.forEach(function (student) {
      var student  = User.get({id: student}, function () {
        $scope.students.push(student)
        console.log(student);
        student.userTrips = UserTrip.query({id: student.userId}, function () {
          console.log(student.userTrips);
        student.powerDistance = dataservice.studentPowerDistance(student.userTrips)
        student.reward = dataservice.calculateReward(student.userTrips)

        })
      })
    })
  console.log($scope);
  })

  $scope.newUser = function () {
    $scope.user.type = 'student' // only parents can create new students
    $scope.user.parent = parseInt($routeParams.id);
    console.log('new user to go into API and database', $scope.user);
    User.save($scope.user, function() {
      //data saved. do something here.
      console.log('trip.save here');
      $route.reload()
    }); //saves an entry. Assuming $scope.trip is the Trip object
  }

}])

app.controller("NewController", ['$scope', '$routeParams', 'Trip', 'User', 'dataservice', function($scope, $routeParams, Trip, User, dataservice){
  console.log("hello from NewController");
  $scope.parent = {}
  $scope.parent.userId = $routeParams.id
  console.log($routeParams.id);
  User.query({id: $routeParams.id}, function (data) {
    $scope.students = data
  })
  $scope.associateUser = function (parent) {
    User.get({id: parseInt($routeParams.id)}, function (){
      console.log('student id?', $scope.student);
    })
  }

}])

app.controller("CalendarController", ['$scope', '$routeParams', '$http', '$route', 'Trip', 'UserTrip', 'calendarservice', function($scope, $routeParams, $http, $route, Trip, UserTrip, calendarservice){
  console.log("hello from CalendarController");

  var today = new Date()
  $scope.month = today.getMonth();
  $scope.year = today.getFullYear();
  $scope.userId = $routeParams;
  // $scope.month = 0;
  // $scope.year = 2014;

  $scope.buildCalendar = function (month, year) {
    // BUILD CALENDAR from user's trips in database:
    $scope.days = calendarservice.getDays($scope.month, $scope.year)
    $scope.maxTrips = calendarservice.maxTrips($scope.days)
    $scope.userTrips = UserTrip.query({id: parseInt($routeParams.id)}, function(){
      // need to calculate user trips in current period with a service
      console.log($scope.userTrips);
      // iterate over days
      $scope.days.forEach(function (day) {
          var date = ($scope.month + 1) + "/" + day.value + "/" + $scope.year
        // Build day object from user trips
        // remember to maintain this day object
        if (day.show) {
          $scope.userTrips.forEach(function(trip) {
            // console.log(trip);
              (calendarservice.buildDayObj(day, trip, date))
              // console.log($scope);
          })
        }
      })
    })
  }

  $scope.buildCalendar($scope.month, $scope.year)
          // console.log($scope.days);

  $scope.nextMonth = function () {
    if ($scope.month === 11) {
      $scope.year = $scope.year + 1
    }
    $scope.month = ($scope.month + 1) % 12
    $scope.buildCalendar($scope.month, $scope.year)
  }
  $scope.prevMonth = function () {
    if ($scope.month === 0) {
      $scope.year = $scope.year - 1
    }
    $scope.month = (12 + ($scope.month - 1)) % 12
    console.log('month', $scope.month);
    $scope.buildCalendar($scope.month, $scope.year)
  }

  // option 1: send package to server, have server do logic if it is to create/edit/delete
  // option 2: if "none", need new, any other, modify
  var dayCounter = []
  $scope.renewAmTrip = function (amObj) {
    // console.log('amObj', amObj);
    // dayCounter.push(amObj.value)
    // console.log(dayCounter.indexOf(amObj.value));
    // if (amObj.am !== 'none' && dayCounter.indexOf(amObj.value) < 0){ // need to also add the criteria that previous value was also none
    if (amObj.am !== 'none'){ // need to also add the criteria that previous value was also none
      $scope.userTrips.length += 1;
      console.log('count', $scope.userTrips.length);
    // } else if (amObj.am === 'none' && dayCounter.indexOf(amObj.value) >= 0){
    } else if (amObj.am === 'none'){
      $scope.userTrips.length -= 1
    }
    // console.log('day coming in to renew', dayObj);
    var amTrip = calendarservice.makeAmTrip(amObj)
    // console.log('amTrip to post', amTrip);
    $http.post(API+ '/trips/user/' + amObj.userId, amTrip)
    // console.log('day after post', dayObj);
  }

  $scope.renewPmTrip = function (pmObj) {
    // var dayCounter = []
    // dayCounter.push(pmObj.value)
    // if (pmObj.pm !== 'none' && dayCounter.indexOf(pmObj.value) < 0){
    //   $scope.userTrips.length += 1;
    // }
    if (pmObj.pm !== 'none'){ // need to also add the criteria that previous value was also none
      $scope.userTrips.length += 1;
      console.log('count', $scope.userTrips.length);
    // } else if (amObj.am === 'none' && dayCounter.indexOf(amObj.value) >= 0){
    } else if (pmObj.pm === 'none'){
      $scope.userTrips.length -= 1
    }

    var pmTrip = calendarservice.makePmTrip(pmObj)
    // console.log('pmTrip to post', pmTrip);
    $http.post(API + '/trips/user/' + pmObj.userId, pmTrip)
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
  //     trip.dwDistance = tripObj.dwDistance;
  //     trip.$update(function() {
  //       console.log('trip updated');
  //     });
  //   });
  // }

}])
