// returns the Trip resource for full Trip CRUD
var API = "https://infinite-bayou-4599.herokuapp.com/api";
// var API = "http://localhost:8080/api";
app.factory('Trip', ["$resource", function ($resource) {
    return $resource(API + '/trips/:id', { id: '@_id' }, {
    update: {
      method: 'PUT' // this method issues a PUT request
    }
  });
}]);

// returns the UserTrip resource
app.factory('UserTrip', ["$resource", function ($resource) {
    return $resource(API + '/trips/user/:id', { id: '@userId'}, {
      send: {
        method: 'POST' // this method issues a POST request
      }
    });
}]);

// returns the User resource
app.factory('User', ["$resource", function ($resource) {
    return $resource(API + '/users/:id', {id: '@userId'});
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

  dataservice.countTripTypes = function (trips) {
    return trips.reduce(function (obj, trip) {
      obj[trip.type] = (obj[trip.type] || 0) + 1;
      return obj
    }, {})
  }

  dataservice.getMonthTrips = function (trips, month) {
   return trips.filter(function (trip) {
     if (trip.date) {
       return ((month + 1)===parseInt(trip.date.split('/')[0]))
     }
   })
  }

  dataservice.getSchoolTrips = function (trips, school) {
    return trips.filter(function (trip) {
      if (trip.school) { // start here!!
        return (trip.school === school)
      }
    })
  }

  dataservice.studentPowerDistance = function (trips) {
    // console.log(trips);
    var sum = 0
    trips.forEach(function (trip){
        if (trip.type === 'walk' || trip.type === 'bike' || trip.type === 'skate'){
          sum += (trip.distance * 1)
        }
        if (trip.dwDistance) {
          sum += (trip.dwDistance * 1)
        }
    })
      return sum;
  }

  dataservice.calculateReward = function (trips) {
    // calculate reward = total number of trips / 4 + total distance / 10 + bonus
    var dist = dataservice.studentPowerDistance(trips);
    console.log('distance from calculate reward: ', dist);
    console.log('number of trips to calculate reward: ', trips.length);
    var bonus = 0;
    if (trips.length === 36) { // MAKE THIS DYNAMIC!!!!
      bonus = 2;
    }
    var reward = (trips.length/4) + (dist/10) + bonus;
    return reward

  }

  return dataservice;
}]);

// calendarservice calculates dates to display on calendar
app.factory('calendarservice', [ function ( ) {
  var calendarservice = {};
  var cal = new Calendar(0);

  var holidays = {
    0: [1, 2, 3, 6, 20],
    1: [14, 17],
    2: [24, 25, 26, 27, 28],
    3: [18, 21],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [7],
    9: [12],
    10: [23,24,25,26,27],
    11: [21,22,23,24,25,28,29,30,31]
  }

  calendarservice.getDays = function (month, year) {
    console.log('hello from calendarservice');
    var weeks = cal.monthDays(year, month); // gets an array of arrays of the weeks
    var days = []
    // get an array of all of the day values in the month
    weeks.forEach(function(week) {
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

  calendarservice.buildDayObj = function (dayObj, trip, date) {
    dayObj.date = date;
    dayObj.userId = trip.userId;
    dayObj.distance = trip.distance; // need to pass these back to database
    dayObj.school = trip.school;

    if (date === trip.date){
      //build day object
      if (trip.dayPart === 'am') { // map dayPart to scope model
        dayObj.am = trip.type;
        dayObj.am_dwDistance = trip.dwDistance;
        dayObj.am_id = trip._id;
      } else if (trip.dayPart === 'pm') {
        dayObj.pm = trip.type;
        dayObj.pm_dwDistance = trip.dwDistance;
        dayObj.pm_id = trip._id;
      }
    }
    return dayObj
  }

  // map day model from scope back to trip model for db
  calendarservice.makeAmTrip = function (dayObj) {
    console.log('am dayObj before', dayObj);
    var amTrip = {};

      amTrip.dayPart = 'am';
      amTrip.type = dayObj.am;
      if (dayObj.am_dwDistance) {
        amTrip.dwDistance = dayObj.am_dwDistance
      }

    amTrip.id = dayObj.am_id
    amTrip.date = dayObj.date
    amTrip.distance = dayObj.distance
    amTrip.school = dayObj.school
    amTrip.userId = dayObj.userId
    console.log('renewed am trip', amTrip);
    return amTrip;
  }

  calendarservice.makePmTrip = function (dayObj) {
    console.log('pm dayObj before', dayObj);
    var pmTrip = {}
    // if (dayObj.pm) {
      pmTrip.dayPart = 'pm';
      pmTrip.type = dayObj.pm;
      if (dayObj.pm_dwDistance) {
        pmTrip.dwDistance = dayObj.pm_dwDistance
      }
    // }
    pmTrip.id = dayObj.pm_id
    pmTrip.date = dayObj.date
    pmTrip.distance = dayObj.distance
    pmTrip.school = dayObj.school
    pmTrip.userId = dayObj.userId
    console.log('renewed pm trip', pmTrip);
    return pmTrip;
  }

  return calendarservice;
}]);



// // userservice gets all users
// app.factory('userservice', ["$resource", function ($resource) {
//   // console.log("id?", $routeParams.id);
//     return $resource(API + '/api/users/')
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
