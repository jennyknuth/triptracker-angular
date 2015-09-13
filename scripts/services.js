app.factory('dataservice', ["$http", "$q", "$resource", function ($http, $q, $resource) {
  console.log("hello from dataservice");
    return $resource('http://localhost:8080/api/users/495653')
}]);
