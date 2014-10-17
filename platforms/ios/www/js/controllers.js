var serviceUrl = 'http://for-good.be/system/en/service/'

angular.module('forgood.controllers', [])

.controller('LoginCtrl', function($scope, $http, $state){
	$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'login'
		}).success(function(data){
			console.log(data);
			$state.go('account-mobility');
		});
	}
})

.controller('MobilityCtrl', function($scope, $http, $state){
	$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'updateMobilityProfile'
		}).success(function(data){
			console.log(data);
			$state.go('account-living');
		});
	}
})

.controller('LivingCtrl', function($scope, $http, $state){
	$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'updateEnergyProfile'
		}).success(function(data){
			console.log(data);
			$state.go('account-monitor');
		});
	}
})

.controller('MonitorCtrl', function($scope, $http, $state){
	$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'updateService'
		}).success(function(data){
			console.log(data);
			$state.go('progress-total');
		});
	}
})

.controller('ProgressCtrl', function($scope, $state){
	$scope.scan = function(){
		alert('test');
		cordova.plugins.barcodeScanner.scan(function(result) {
			alert("We got a barcode\n" +
			"Result: " + result.text + "\n" +
			"Format: " + result.format + "\n" +
			"Cancelled: " + result.cancelled);
		}, 
		function(error){
			alert("Scanning failed: " + error);
		});
	}
});
