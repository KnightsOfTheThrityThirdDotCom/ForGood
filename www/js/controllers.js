var serviceUrl = 'http://for-good.be/system/en/service/';

var sha = null;

if(window.localStorage.user){
	var user = JSON.parse(window.localStorage.user);
	sha = '/sha='+user.sha;
}

angular.module('forgood.controllers', [])

.controller('MainCtrl', function($scope, $http, $state, $ionicViewService){
	
	var popUp = document.getElementsByClassName('pop-up');
	var popupHeader = popUp[0].getElementsByClassName('title');
	var popupText = popUp[0].getElementsByClassName('text');
	
	$scope.openPopup = function($event){
		console.log('test');
		var title = $event.target.dataset.title;
		var text = $event.target.dataset.text;
		popupHeader[0].innerHTML = title;
		popupText[0].innerHTML = text;
		popUp[0].classList.remove('hidden');
	};
	
	$scope.closePopup = function(){
		popUp[0].classList.add('hidden');
	};
})

.controller('LogoutCtrl', function($scope, $http, $state, $ionicViewService){
	
	$ionicViewService.nextViewOptions({
		disableBack: true
	});
	
	window.localStorage.clear();
	
	$state.go('login');
	
})

.controller('LoginCtrl', function($scope, $http, $state, $ionicViewService, $ionicLoading){
	
	if(window.localStorage.user){
		var user = JSON.parse(window.localStorage.user);
	}
		
	if(window.localStorage.user && user.nulmeting){
		console.log(user);
		$state.go('progress');
		$ionicViewService.nextViewOptions({
			disableBack: true
		});
	} else if (window.localStorage.user && user.nulmeting === 0){
		$state.go('account-mobility');
		$ionicViewService.nextViewOptions({
			disableBack: true
		});
	}
	
	$scope.formData;
	$scope.processForm = function()	{
		$ionicLoading.show({
	      template: 'Aanmelden...'
	    });
	
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'login',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			if(data.success === 1){
				$ionicLoading.hide();
				sha = '/sha='+data.user.sha;
				var user = JSON.stringify(data.user);
				window.localStorage.user = user;
				if(data.user.nulmeting === 1){
					$state.go('progress');
				} else {
					$state.go('account-mobility');
				}
			} else {
				$ionicLoading.hide();
				alert('Gelieve in te loggen met de juiste gegevens.');
			}
		});
	}
})

.controller('CreateAccountCtrl', function($scope, $http, $state, $ionicViewService){
	
	$scope.formData;
	$scope.processForm = function()	{
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'createProfile',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			if(data.success === 1){
				sha = '/sha='+data.user.sha;
				var user = JSON.stringify(data.user);
				console.log(data.user.sha);
				window.localStorage.user = user;
				$state.go('account-mobility');
			} else {
				alert('Gelieve in te loggen met de juiste gegevens.');
			}
		});
	}
})

.controller('ForgotPasswordCtrl', function($scope, $http, $state, $ionicViewService){
	
	$scope.formData;
	$scope.processForm = function()	{
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'forgotPassword',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			if(data.success === 1){
				console.log(data);
				$state.go('login');
			} else {
				console.log(data);
				alert('Van dit e-mail adres bestaan geen gegevens.');
			}
		});
	}
})

.controller('MobilityCtrl', function($scope, $http, $state){
	
	$scope.formData = {};
	
	$scope.formData.unitType = '1';
	
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateMobilityProfile'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$state.go('account-energy');
		});
	};
})

.controller('EnergyCtrl', function($scope, $http, $state){
	
	$scope.formData = {
		electricityType: '2',
		yearlyConsumptionHeatingUnit: '2'
	};

	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateEnergyProfile'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			console.log(data);
			$state.go('account-monitor');
		});
	}
})

.controller('MonitorCtrl', function($scope, $http, $state, $ionicViewService){
	$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateService'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			console.log(data);
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			$state.go('progress');
		});
	};
})

.controller('ProgressCtrl', function($scope, $http, $state, Product){
	
	var chartData;
	
	$scope.init = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'stats'+sha
		}).success(function(data){
			$scope.dataTotal = data;
			console.log($scope.dataTotal);
			var chartData = {
				chartTotal: [
					{
						// Mobiliteit
						value: data.chart.CIRCLE_MOBILITEIT_100,
						color:"#46acf1"
					},
					{
						// Energie
						value : data.chart.CIRCLE_ENERGY_100,
						color : "#eecc30"
					},
					{
						// Consumptie
						value : data.chart.CIRCLE_FOOD_100,
						color : "#f7395e"
					}
				],
				chartMobility: [
					{
						// Wagen
						value: 30,
						color:"#235679"
					},
					{
						// Openbaar vervoer
						value : 50,
						color : "#388ac1"
					},
					{
						// Vluchten
						value : 20,
						color : "#46acf1"
					}
				],
				chartEnergy: [
					{
						// Elektriciteit
						value: 30,
						color:"#776618"
					},
					{
						// Verwarming
						value : 70,
						color : "#bea326"
					}
				],
				chartConsumption: [
					{
						// Verpakking
						value: 10,
						color:"#7c1d2f"
					},
					{
						// Transport
						value : 30,
						color : "#c62e4b"
					},
					{
						// Bewaring
						value : 20,
						color : "#f7395e"
					},
					{
						// Seizoen
						value : 20,
						color : "#fb9cae"
					},
					{
						// Ingrediënten
						value : 20,
						color : "#46acf1"
					}
				]
			};
			var chartTotal = document.getElementById("chart-total").getContext("2d");
			var chartMobility = document.getElementById("chart-mobility").getContext("2d");
			var chartEnergy = document.getElementById("chart-energy").getContext("2d");
			var chartConsumption = document.getElementById("chart-consumption").getContext("2d");
			
			var options = {
				animation : false,
				segmentStrokeWidth :1,
				percentageInnerCutout : 65,
				segmentStrokeColor : "#f3efe7"
			}
			
			new Chart(chartTotal).Doughnut(chartData.chartTotal,options);
			new Chart(chartMobility).Doughnut(chartData.chartMobility,options);
			new Chart(chartEnergy).Doughnut(chartData.chartEnergy,options);
			new Chart(chartConsumption).Doughnut(chartData.chartConsumption,options);
			$scope.dataTotal.chart.TOTAL_PLANET = $scope.dataTotal.chart.TOTAL_PLANET.toFixed(1);
		});
	};
	
	$scope.init();
		
		
	var bullets = document.getElementById('swipe-position').getElementsByTagName('span');
	var graphs = document.getElementById('graphs').getElementsByClassName('cats');
	window.mySwipe = Swipe(document.getElementById('swipe'), {
		continuous: false,
		callback: function(pos) {
			console.log(graphs);
			var i = bullets.length;
	        while (i--) {
	        	bullets[i].className = 'off';
	        	graphs[i].classList.remove('on');
	        }
			bullets[pos].className = 'on';
			graphs[pos].classList.add('on');
		}
	});
	
	$scope.scan = function(){
		
			/*var postData = {
				ean: 7613033006944
			};			
			
			$http({
				method  : 'POST',
				crossDomain: true,
				data    :  $.param(postData),
				url     : serviceUrl+'getProduct'+sha,
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function(data){
				Product.submit(data);
				$state.go('product');
			});*/
		
		cordova.plugins.barcodeScanner.scan(function(result) {
			
			
			console.log(result);
			
			var postData = {
				ean: result.text
			};
			$http({
				method  : 'POST',
				crossDomain: true,
				data    : $.param(postData),
				url     : serviceUrl+'getProduct'+sha,
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			}).success(function(data){
				Product.submit(data);
				$state.go('product');
			});
		}, 
		function(error){
			alert("Scanning failed: " + error);
		});
	};
})

.controller('UpdateCtrl', function($scope, $http, $state, $ionicViewService){
	
	console.log('test');
	
	$scope.init = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'getProfile'+sha
		}).success(function(data){
			$scope.currentValue = data.user;
			console.log($scope);
		});
	};
	
	$scope.init();

	
	/*$scope.formData = {};
	$scope.processForm = function()	{
		console.log($scope.formData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'updateService'+sha
		}).success(function(data){
			console.log(data);
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			$state.go('progress');
		});
	};*/
	
})

.controller('ProductCtrl', function($scope, $http, $state, $ionicViewService, Product){
	$scope.init = function(){
		$scope.product = Product.get();
		console.log($scope.product);
	};
	
	$scope.init();
});
