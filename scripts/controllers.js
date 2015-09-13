app.controller("TTController", ['$scope', function($scope){
  console.log('hello from TTController');
  $scope.userId = 495653;
}])

app.controller("UserController", ['$scope', 'dataservice', function($scope, dataservice){
  console.log('hello from UserController');
  var userTrips = dataservice.query(function() {
      console.log(userTrips);
    });
}])
