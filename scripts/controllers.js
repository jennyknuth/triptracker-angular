app.controller("TTController", ['$scope', 'userservice', function($scope, userservice){
  console.log('hello from TTController');
  var users = userservice.query();
  $scope.users = users
  // $scope.userId = 495653;
  // $scope.userId = 431094; //this will come from where? firebase?

}])

app.controller("UserController", ['$scope', 'dataservice', function($scope, dataservice){
  var userTrips = dataservice.query();
  $scope.userTrips = userTrips
  console.log(userTrips);
}])
