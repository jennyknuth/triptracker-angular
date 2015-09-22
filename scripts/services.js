// returns the Trip resource for full Trip CRUD
app.factory('Trip', ["$resource", function ($resource) {
    return $resource('http://localhost:8080/api/trips/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
}]);

// returns the UserTrip resource
app.factory('UserTrip', ["$resource", function ($resource) {
    return $resource('http://localhost:8080/api/trips/user/:id', { id: '@userId', date: '@date', dayPart: '@dayPart' });
}]);

// returns the User resource
app.factory('User', ["$resource", function ($resource) {
    return $resource('http://localhost:8080/api/users/:id', { id: '@userId', parentId: '@parentId' });
}]);

// dataService calculates data
app.factory('dataservice', ["$routeParams", "User", function ($routeParams, User) {
  var dataservice = {};

  dataservice.totalDistance = function (trips) {
    var sum = 0
    trips.forEach(function (trip){
      if (trip.distance) {
        sum += (trip.distance * 1)
      }
    })
    console.log(sum);
    return sum;
  }

  dataservice.studentPowerDistance = function (trips) {
    var sum = 0
    trips.forEach(function (trip){
      if (trip.type === 'walk' || trip.type === 'bike' || trip.type === 'drive and drop' || trip.type === 'skate/scoot')
      sum += (trip.distance * 1)
    })
    console.log(sum);
    return sum;
  }

  dataservice.calculateReward = function (trips) {
    // calculate reward = total number of trips / 4 + total distance / 10 + bonus
    var dist = dataservice.studentPowerDistance(trips);
    console.log('distance: ', dist);
    var bonus = 0;
    if (trips.length === 36) {
      bonus = 2;
    }
    var reward = (trips.length/4) + (dist/10) + bonus;
    return reward

  }

  return dataservice;
}]);

// calendarservice calculates dates to display on calendar
app.factory('calendarservice', [ function () {
  var calendarservice = {};
  var cal = new Calendar(0);

  var holidays = {
    0: [1, 2, 3, 6, 20],
    1: [14, 17],
    2: [24, 25, 26, 27, 28],
    3: [18, 21],
    8: [7]
  }

  calendarservice.getDays = function (month, year) {
    console.log('hello from calendarservice');
    var weeks = cal.monthDays(year, month); // gets an array of arrays of the weeks
    var days = []
    weeks.forEach(function(week) { // gets an array of all of the day values in the month
      for (var i = 0; i < week.length; i++) {
        var dayObj = {}
        // console.log('week[i]', week[i]);
        dayObj.value = week[i]
        dayObj.show = true;
        // don't show weekends or holidays
        if (i === 0 || i === week.length -1 || week[i] === 0 || holidays[month].indexOf(week[i]) >= 0) {
          dayObj.show = false;
          if (holidays[month].indexOf(week[i]) >= 0) {
            dayObj.message = "NO SCHOOL"
          }
        }
        days.push(dayObj)
      }
    })
  return days
  }

  calendarservice.maxTrips = function (days) {
    var trips = 0
    days.forEach(function (day) {
      if (day.show === true){
        trips += 2
      }
    })
    return trips
  }

  return calendarservice;
}]);



// // userservice gets all users
// app.factory('userservice', ["$resource", function ($resource) {
//   // console.log("id?", $routeParams.id);
//     return $resource('http://localhost:8080/api/users/')
// }]);
//
//
// // good tutorial on CRUD with $resource here: http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/
//
// swordservice.getSwords = function() {
//     var deferred = $q.defer();
//     $http.get(url).success(function (data) {
//       deferred.resolve(data);
//     }).error(function () {
//       deferred.reject("Error!");
//     });
//     return deferred.promise;
//   }
//   swordservice.getSword = function(item){
//     var deferred = $q.defer();
//     $http.get(url + '/' + item.id).success(function (data) {
//       deferred.resolve(data);
//     }).error(function () {
//       deferred.reject("Error!");
//     });
//     return deferred.promise;
//   }
//   swordservice.newSword = function(sword) {
//     $http.post(url, sword).then(function(response){
//       console.log(response);
//       $route.reload();
//     });
//   }
//   // swordservice.update = function(sword) {
//   //   console.log(sword);
//   //   $http.put(url + '/' + sword._id, sword).then(function(response) {
//   //     console.log(response);
//   //     $route.reload();
//   //   });
//   // }
//   swordservice.remove = function(sword) {
//     console.log(sword);
//     $http.delete(url + '/' + sword._id, sword).then(function(response) {
//       console.log(response);
//       $route.reload();
//     });
//   }
//   swordservice.update = function(sword) {
//     console.log(sword);
//     sword.edit = undefined
//     $http.put(url + '/' + sword._id, sword).then(function(response) {
//       console.log(response);
//       $route.reload();
//     });
//   }
