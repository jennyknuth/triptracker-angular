// dataservice gets all trips for current userId
app.factory('dataservice', ["$resource", "$routeParams", function ($resource, $routeParams) {
  // console.log("id?", $routeParams.id);
    return $resource('http://localhost:8080/api/users/' + $routeParams.id)
}]);

// userservice gets all users
app.factory('userservice', ["$resource", function ($resource) {
  // console.log("id?", $routeParams.id);
    return $resource('http://localhost:8080/api/users/')
}]);


// good tutorial on CRUD with $resource here: http://www.sitepoint.com/creating-crud-app-minutes-angulars-resource/
