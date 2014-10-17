var serviceUrl = 'http://for-good.be/system/nl/service/';

var sha = null;

if(window.localStorage.user){
	var user = JSON.parse(window.localStorage.user);
	sha = '/sha='+user.sha;
};

angular.module('forgood.controllers', [])

.controller('MainCtrl', function($scope, $http, $state, $ionicViewService, $ionicPopup, $ionicPlatform, $ionicPopup){
	
	$ionicPlatform.ready(function(){
		document.addEventListener("offline", onOffline, false);
		function onOffline() {
			$ionicPopup.show({
				title: 'Geen netwerk verbinding',
				template: 'De app kan geen verbinding maken met het internet.',
				 buttons: [
				 	{
				 		text:'sluiten',
				 		type: 'bgGreen'
				 	}
				 ]
			});
			/*var networkOverlay = document.getElementsByClassName('network-overlay');
			networkOverlay[0].classList.remove('hidden');
			networkOverlay[0].classList.add('fadeIn');*/
		};
	});
	
	$scope.openPopup = function(title,text){
		console.log(title,text);
		$ionicPopup.show({
			title: title,
			template: text,
			 buttons: [
			 	{
			 		text:'sluiten',
			 		type: 'bgGreen'
			 	}
			 ]
		});
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

.controller('LoginCtrl', function($scope, $http, $state, $ionicViewService, $ionicLoading, $ionicNavBarDelegate){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Login');
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

.controller('CreateAccountCtrl', function($scope, $http, $state, $ionicViewService, $ionicPopup, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Create Account');
	}
	
	$scope.formData;
	$scope.processForm = function()	{
		if($scope.formData.password !== $scope.formData.passwordCheck){
			$ionicPopup.show({
				title: 'Wachtwoord validatie onjuist',
				template: 'U heeft twee keer een ander wachtwoord ingevuld. Gelieve twee keer hetzelfde wachtwoord in te vullen.',
				 buttons: [
				 	{
				 		text:'Sluiten',
				 		type: 'bgGreen'
				 	}
				 ]
			});
		} else {
		    $ionicLoading.show({
    	      template: 'Account aanmaken...'
    	    });
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
					$ionicLoading.hide();
					sha = '/sha='+data.user.sha;
					var user = JSON.stringify(data.user);
					console.log(data.user.sha);
					window.localStorage.user = user;
					$state.go('account-mobility');
				} else {
				    $ionicLoading.hide();
					alert('Gelieve een juist email adres op te geven en een wachtwoord met minstens vier karakters.');
				}
			});
		}
	}
})

.controller('ForgotPasswordCtrl', function($scope, $http, $state, $ionicViewService, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Forgot Password');
	}
	
	$scope.formData;
	$scope.processForm = function()	{
		$ionicLoading.show({
	      template: 'Wachtwoord opvragen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'forgotPassword'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			if(data.success === 1){
				$ionicLoading.hide();
				$state.go('login');
			} else {
				$ionicLoading.hide();
				alert('Van dit e-mail adres bestaan geen gegevens.');
			}
		});
	}
})

.controller('MobilityCtrl', function($scope, $rootScope, $http, $state, $ionicViewService, $ionicLoading){
	
	$scope.formData = {};
	
	$scope.formData.fuelType = '0';
	$scope.formData.averageConsumption = '0';
	$scope.formData.unitType = '1';
	
	$scope.hasCar = 'true';
	
	if(window.localStorage.mobilityBackup){
		var savedData = JSON.parse(window.localStorage.mobilityBackup);
		$scope.formData = savedData;
	}
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Initial Mobility input');
	}
	
	$scope.processForm = function()	{
		$ionicLoading.show({
	      template: 'Gegevens versturen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateMobilityProfile'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicLoading.hide();
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			$state.go('account-energy');
		});
	};
	
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		var saveData = JSON.stringify($scope.formData);
		window.localStorage.mobilityBackup = saveData;
	});
	
})

.controller('EnergyCtrl', function($scope, $rootScope, $http, $state, $ionicViewService, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Initial Energy input');
	}
			
	$scope.formData = {
		electricityType: '2',
		yearlyConsumptionHeatingUnit: '2',
		fuelTypeHeating: '0',
		userKnowsEnergy: 'true',
		typeMeter: 'double'
	};
	
	if(window.localStorage.energyBackup){
		var savedData = JSON.parse(window.localStorage.energyBackup);
		$scope.formData = savedData;
	}

	$scope.processForm = function()	{
		$ionicLoading.show({
	      template: 'Gegevens versturen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateEnergyProfile'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicLoading.hide();
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			$state.go('account-monitor');
		});
	}
	
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		var saveData = JSON.stringify($scope.formData);
		window.localStorage.energyBackup = saveData;
	});
})

.controller('MonitorCtrl', function($scope, $rootScope, $http, $state, $ionicViewService, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Initial Monitoring input');
	}
	
	$scope.formData = {};
	
	if(window.localStorage.monitorBackup){
		var savedData = JSON.parse(window.localStorage.monitorBackup);
		$scope.formData = savedData;
	}
	
	$scope.processForm = function()	{
		$ionicLoading.show({
            template: 'Gegevens versturen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateService'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicLoading.hide();
			$ionicViewService.nextViewOptions({
				disableBack: true
			});
			var updateUser = JSON.parse(window.localStorage.user);
			updateUser.nulmeting = 1;
			window.localStorage.user = JSON.stringify(updateUser);
			$state.go('progress');
		});
	};
	
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
		var saveData = JSON.stringify($scope.formData);
		window.localStorage.monitorBackup = saveData;
	});
})

.controller('ProgressCtrl', function($scope, $rootScope, $ionicPlatform, $http, $state, $ionicPopup, Product, UserData, tips, $ionicScrollDelegate, $ionicModal, $ionicViewService, $ionicLoading){

	if(typeof analytics !== "undefined") { 
		analytics.trackView('Main Progress overview');
	}
	
	if(window.localStorage.mobilityBackup || window.localStorage.energyBackup|| window.localStorage.monitorBackup){
		window.localStorage.removeItem('mobilityBackup');
		window.localStorage.removeItem('energyBackup');
		window.localStorage.removeItem('monitorBackup');
	}
	
	$scope.loadCharts = function(){
		
		$scope.chartData = {
			chartTotal: [
				{
					// Mobiliteit
					value: $scope.dataTotal.TOTAL.circle.mobility_100,
					color:"#46acf1"
				},
				{
					// Energie
					value : $scope.dataTotal.TOTAL.circle.energy_100,
					color : "#eecc30"
				},
				{
					// Consumptie
					value : $scope.dataTotal.TOTAL.circle.consumption_100,
					color : "#f7395e"
				},
				{
					// Vaste voetafdruk Belg
					value : 0,
					color : '#000'
				}
			],
			chartMobility: [
				{
					// Wagen
					value: $scope.dataTotal.MOBILITY.circle.car_100,
					color:"#235679"
				},
				{
					// Openbaar vervoer
					value : $scope.dataTotal.MOBILITY.circle.public_100,
					color : "#388ac1"
				},
				{
					// Vluchten
					value : $scope.dataTotal.MOBILITY.circle.plane_100,
					color : "#46acf1"
				}
			],
			chartEnergy: [
				{
					// Elektriciteit
					value: $scope.dataTotal.ENERGY.circle.elec_100,
					color:"#776618"
				},
				{
					// Verwarming
					value : $scope.dataTotal.ENERGY.circle.heat_100,
					color : "#bea326"
				}
			],
			chartConsumption: [
				{
					// Verpakking
					value: $scope.dataTotal.CONSUMPTION.circle.package_100,
					color:"#f7395e"
				},
				{
					// Transport
					value : $scope.dataTotal.CONSUMPTION.circle.transport_100,
					color : "#fb9cae"
				},
				{
					// Bewaring
					value : $scope.dataTotal.CONSUMPTION.circle.storage_100,
					color : "#c62e4b"
				},
				{
					// Seizoen
					value : $scope.dataTotal.CONSUMPTION.circle.season_100,
					color : "#fdd7df"
				},
				{
					// Ingrediënten
					value : $scope.dataTotal.CONSUMPTION.circle.ingredients_100,
					color : "#7c1d2f"
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
		};
		
		$scope.chartTotal = new Chart(chartTotal).Doughnut($scope.chartData.chartTotal,options);
		$scope.chartMobility = new Chart(chartMobility).Doughnut($scope.chartData.chartMobility,options);
		$scope.chartEnergy = new Chart(chartEnergy).Doughnut($scope.chartData.chartEnergy,options);
		$scope.chartConsumption = new Chart(chartConsumption).Doughnut($scope.chartData.chartConsumption,options);
		
	};
	
	$scope.reloadCharts = function(){
		$scope.chartData = {
			chartTotal: [
				{
					// Mobiliteit
					value: $scope.dataTotal.TOTAL.circle.mobility_100,
					color:"#46acf1"
				},
				{
					// Energie
					value : $scope.dataTotal.TOTAL.circle.energy_100,
					color : "#eecc30"
				},
				{
					// Consumptie
					value : $scope.dataTotal.TOTAL.circle.consumption_100,
					color : "#f7395e"
				},
				{
					// Vaste voetafdruk Belg
					value : 0,
					color : '#000'
				}
			],
			chartMobility: [
				{
					// Wagen
					value: $scope.dataTotal.MOBILITY.circle.car_100,
					color:"#235679"
				},
				{
					// Openbaar vervoer
					value : $scope.dataTotal.MOBILITY.circle.public_100,
					color : "#388ac1"
				},
				{
					// Vluchten
					value : $scope.dataTotal.MOBILITY.circle.plane_100,
					color : "#46acf1"
				}
			],
			chartEnergy: [
				{
					// Elektriciteit
					value: $scope.dataTotal.ENERGY.circle.elec_100,
					color:"#776618"
				},
				{
					// Verwarming
					value : $scope.dataTotal.ENERGY.circle.heat_100,
					color : "#bea326"
				}
			],
			chartConsumption: [
				{
					// Verpakking
					value: $scope.dataTotal.CONSUMPTION.circle.package_100,
					color:"#f7395e"
				},
				{
					// Transport
					value : $scope.dataTotal.CONSUMPTION.circle.transport_100,
					color : "#fb9cae"
				},
				{
					// Bewaring
					value : $scope.dataTotal.CONSUMPTION.circle.storage_100,
					color : "#c62e4b"
				},
				{
					// Seizoen
					value : $scope.dataTotal.CONSUMPTION.circle.season_100,
					color : "#fdd7df"
				},
				{
					// Ingrediënten
					value : $scope.dataTotal.CONSUMPTION.circle.ingredients_100,
					color : "#7c1d2f"
				}
			]
		};
		
		for(var i = 0;i<$scope.chartTotal.segments.length;i++){
			$scope.chartTotal.segments[i].value = $scope.chartData.chartTotal[i].value;
			$scope.chartTotal.update();
		}
		for(var i = 0;i<$scope.chartMobility.segments.length;i++){
			$scope.chartMobility.segments[i].value = $scope.chartData.chartMobility[i].value;
			$scope.chartMobility.update();
		}
		for(var i = 0;i<$scope.chartEnergy.segments.length;i++){
			$scope.chartEnergy.segments[i].value = $scope.chartData.chartEnergy[i].value;
			$scope.chartEnergy.update();
		}
		for(var i = 0;i<$scope.chartConsumption.segments.length;i++){
			$scope.chartConsumption.segments[i].value = $scope.chartData.chartConsumption[i].value;
			$scope.chartConsumption.update();
		}
	};
    	
	$rootScope.loadUserData = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			url     : serviceUrl+'stats'+sha
		}).success(function(data){
			console.log(data);
			$scope.totalFootprint = data.footprint_total;
			$scope.scale = data.SCALE;			
			$scope.dataTotal = data;		
			window.localStorage.userData = JSON.stringify(data);
			$scope.loadCharts();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$rootScope.reloadUserData = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			url     : serviceUrl+'stats'+sha
		}).success(function(data){			
			$scope.dataTotal = data;		
			window.localStorage.userData = JSON.stringify(data);
			$scope.reloadCharts();
			$scope.$broadcast('scroll.refreshComplete');
		});
	};
	
	$rootScope.loadTips = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			url     : serviceUrl+'getTips'+sha
		}).success(function(data){
			console.log(data);
			$scope.tips = data;
			window.localStorage.tips = JSON.stringify(data);
		});
	};	
	
	document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady(){
        if(navigator.network.connection.type == Connection.NONE){
            var userData = JSON.parse(window.localStorage.userData);
            var tipsData = JSON.parse(window.localStorage.tips);
            $scope.dataTotal = userData;
            $scope.tips = tipsData;
			$scope.loadCharts();
			$scope.$apply();
        } else {
        	$rootScope.loadUserData();
			$rootScope.loadTips();
        }
    };
    
    if(window.localStorage.desktop){
	    $rootScope.loadUserData();
		$rootScope.loadTips();
    }
    
	var bullets = document.getElementById('swipe-position').getElementsByTagName('span');
	var graphs = document.getElementById('graphs').getElementsByClassName('cats');
	
	window.mySwipe = Swipe(document.getElementById('swipe'), {
		continuous: false,
		callback: function(pos) {
			var i = bullets.length;
	        while (i--) {
	        	bullets[i].className = 'off';
	        	graphs[i].classList.remove('on');
	        }
			bullets[pos].className = 'on';
			graphs[pos].classList.add('on');
			$scope.hideSub = true;
		},
		transitionEnd: function(){
			$ionicScrollDelegate.$getByHandle('scroll').scrollTop();
		}
	});
	
	$scope.goToSlide = function(index){
		window.mySwipe.slide(index);
	};
	
	$scope.scan = function(){
		
		/*var postData = {
			ean: 23423//54490000
		};			
		
		$http({
			method  : 'POST',
			crossDomain: true,
			data    :  $.param(postData),
			url     : serviceUrl+'getProduct'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			console.log(data);
			if(data.success === 1){
				Product.submit(data);
				$state.go('product');
			} else {
				$rootScope.missingEan = postData.ean;
				$ionicPopup.show({
					title: 'Geen product gevonden',
					template: 'Helaas, dit product zit nog niet in ons systeem. Stuur ons een foto van het product en we zorgen dat deze zo snel mogelijk is ons systeem wordt toegevoegd.',
					 buttons: [
					 	{
						 	text: 'Neem foto',
						 	type: 'bgBlue f-s-small',
						 	onTap: function(e){
							 	$scope.eanModal.show();
						 	}
					 	},
					 	{
					 		text:'Nieuwe scan',
					 		type: 'bgGreen f-s-small',
					 		onTap: function(e){
							 	$ionicPopup.close();
							 	$scope.scan();
						 	}
					 	},
					 	{
					 		text:'Sluit',
					 		type: 'bgRed f-s-small'
					 	}
					 ]
				});
			}
		});*/
				
		cordova.plugins.barcodeScanner.scan(function(result) {			
			
			console.log(result);
					
			if(!result.cancelled){
				var postData = {
					ean: result.text
				};
				$ionicLoading.show({
        	      template: 'Product ophalen...'
        	    });
				$http({
					method  : 'POST',
					crossDomain: true,
					data    : $.param(postData),
					url     : serviceUrl+'getProduct'+sha,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).success(function(data){
					$ionicLoading.hide();
					if(data.success === 1){
						Product.submit(data);
						$state.go('product');
					} else {
						$rootScope.missingEan = postData.ean;
						$ionicPopup.show({
							title: 'Geen product gevonden',
							template: 'Helaas, dit product zit nog niet in ons systeem. Stuur ons een foto van het product en we zorgen dat deze zo snel mogelijk is ons systeem wordt toegevoegd.',
							 buttons: [
        					 	{
        						 	text: 'Neem foto',
        						 	type: 'bgBlue f-s-small',
        						 	onTap: function(e){
        							 	$scope.eanModal.show();
        						 	}
        					 	},
        					 	{
        					 		text:'Nieuwe scan',
        					 		type: 'bgGreen f-s-small',
        					 		onTap: function(e){
        							 	$scope.scan();
        						 	}
        					 	},
        					 	{
        					 		text:'Sluit',
        					 		type: 'bgRed f-s-small'
        					 	}
        					 ]
						});
					}
				});
			}
		}, 
		function(error){
			//alert("Scanning failed: " + error);
		});
	};
	
	$scope.currentGraph = 'period';
	
	$scope.changeGraph = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			url     : serviceUrl+'stats'+sha+'/'+this.currentGraph
		}).success(function(data){
			$scope.scale = data.SCALE;
			$scope.dataTotal.TOTAL.graph_final = data.TOTAL.graph_final;
			$scope.dataTotal.ENERGY.graph_final = data.ENERGY.graph_final;
			$scope.dataTotal.MOBILITY.graph_final = data.MOBILITY.graph_final;
			$scope.dataTotal.CONSUMPTION.graph_final = data.CONSUMPTION.graph_final;
			
		});

	};
	
	$scope.ignoreTip = function(id,kind){
		
		console.log(kind);
		
		var postData = {
			tipID: id,
			kind: kind
		};
				
		$http({
			method  : 'POST',
			crossDomain: true,
			data    :  $.param(postData),
			url     : serviceUrl+'ignoreTip'+sha,
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			console.log(data);
			
			if(data.success === 1){
				tips.remove($scope.tips,id,data.tip);
				$ionicScrollDelegate.$getByHandle('scroll').resize();
			}
		});
	
	};
	
	/*$scope.totalPlanets = function(num) {
    	num = parseFloat(num);
       	num = Math.round(num);
        return new Array(num);
    };*/
    
    $ionicModal.fromTemplateUrl('templates/bill.html', function(modal) {
    	$scope.billModal = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('templates/update-mobility.html', function(modal) {
    	$scope.updateMobilityModal = modal;
	},{
		scope: $scope,
		focusFirstInput: false,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('templates/update-energy.html', function(modal) {
    	$scope.updateEnergyModal = modal;
	},{
		scope: $scope,
		focusFirstInput: false, 
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('templates/settings.html', function(modal) {
    	$scope.settingsModal = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$ionicModal.fromTemplateUrl('templates/ean.html', function(modal) {
    	$scope.eanModal = modal;
	},{
		scope: $scope,
		animation: 'slide-in-up'
	});
	
	$scope.openResetPopup = function(){
		$ionicPopup.show({
			title: 'Account resetten',
			template: 'Weet je zeker dat je jouw account wil resetten? Alle gegevens van mobiliteit, wonen en consumptie zullen gewist worden.',
			 buttons: [
			 	{
				 	text: 'Resetten',
				 	type: 'bgOrange',
				 	onTap: function(e){
					 	$http({
							method  : 'POST',
							crossDomain: true,
							url     : serviceUrl+'resetAccount'+sha,
							headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
						}).success(function(data){
							$ionicViewService.nextViewOptions({
								disableBack: true
							});
							if(data.success === 1){
								var user = JSON.stringify(data.user);
								window.localStorage.user = user;
								$scope.settingsModal.hide();
								$state.go('account-mobility');
							}
						});
				 	}
			 	},
			 	{
			 		text:'Annuleren',
			 		type: 'bgGreen'
			 	}
			 ]
		});	
	};
	
	$scope.logout = function(){
		$scope.settingsModal.hide().then(function(){
			window.localStorage.clear();
			$state.go('logout');
		});
	};
	
	$scope.hideSub = true;
	
	$scope.toggleSub = function() {
        $scope.hideSub = $scope.hideSub === false ? true: false;
    };
    
    $scope.closeSub = function() {
        $scope.hideSub = true;
    };
	
})

.controller('UpdateMobilityCtrl', function($scope, $rootScope, $http, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Updating Mobility monitoring');
	}	
		
	$scope.init = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'getProfile'+sha
		}).success(function(data){
			$scope.currentValue = data.user;
		});
	};
	
	$scope.init();

	
	$scope.formData = {};
	$scope.processForm = function(value){		
		$ionicLoading.show({
	      template: 'Gegevens versturen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateMobilityService'+sha,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicLoading.hide();
			$rootScope.loadUserData();
			$scope.updateMobilityModal.hide();
		});
	};
	
})

.controller('UpdateEnergyCtrl', function($scope, $rootScope, $http, $ionicLoading){	
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Updating Energy monitoring');
	}
	
	$scope.init = function(){
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $scope.formData,
			url     : serviceUrl+'getProfile'+sha
		}).success(function(data){
			$scope.currentValue = data.user;
		});
	};
	
	$scope.init();

	
	$scope.formData = {};
	$scope.processForm = function()	{
		$ionicLoading.show({
	      template: 'Gegevens versturen...'
	    });
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param($scope.formData),
			url     : serviceUrl+'updateEnergyService'+sha,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$ionicLoading.hide();
			$rootScope.loadUserData();
			$scope.updateEnergyModal.hide();
		});
	};
	
})

.controller('ProductCtrl', function($scope, $http, $state, $ionicViewService, Product, $ionicLoading){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Product view');
	}
	
	$scope.init = function(){
		$scope.product = Product.get();
		console.log($scope.product);
	};
	
	$scope.init();
})

.controller('BillCtrl', function($scope, $http, $state, $ionicViewService, $ionicLoading, $ionicPopup, $ionicModal, Product){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Add Bill view');
	}
	
	$scope.pictures = [];
	
	$scope.captureImg = function(){
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.DATA_URL, targetWidth: 1000, targetHeight: 1000});
	};
	
	$scope.deleteBill = function(index){
		$scope.pictures.splice(index,1);
	};
	
	function onSuccess(imageData) {
	    setTimeout(function(){
		    $scope.pictures.push(imageData);
		    $scope.$apply();
	    }, 10);
	};

	function onFail(message) {
	    
	};
	
	$scope.submitBills = function(){
		$ionicLoading.show({
			template: 'Bezig met versturen...'
		});
		var postData = {
			pictures: $scope.pictures
		};
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param(postData),
			url     : serviceUrl+'addBill'+sha,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$scope.pictures.length = 0;
			$ionicLoading.hide();
			$ionicPopup.show({
				title: 'Rekening(en) uploaden voltooid',
				template: 'Het uploaden van jouw rekening(en) is voltooid. Één van onze medewerkers zal je aangekochte producten analyseren en ze toevoegen aan je account.',
				 buttons: [
				 	{
				 		text:'Sluiten',
				 		type: 'bgGreen',
				 		onTap: function(e){
					 		$scope.$parent.$parent.billModal.hide();
					 	}
				 	}
				 ]
			});
		});	
	};
	
})

.controller('EanCtrl', function($scope, $rootScope, $http, $state, $ionicViewService, $ionicLoading, $ionicPopup, Product){
	
	if(typeof analytics !== "undefined") { 
		analytics.trackView('Submit EAN view');
	}
	
	$scope.picture = null;
	
	$scope.captureEan = function(){
		navigator.camera.getPicture(onSuccess, onFail, { quality: 50,destinationType: Camera.DestinationType.DATA_URL, targetWidth: 1000, targetHeight: 1000});
	};
	
	$scope.deleteEan = function(index){
		$scope.picture = null;
	};
	
	function onSuccess(imageData) {
	    setTimeout(function(){
		    $scope.picture = imageData;
			$scope.$apply();
	    }, 10);
	};

	function onFail(message) {
	    
	};
	
	$scope.submitEan = function(){
		$ionicLoading.show({
			template: 'Bezig met versturen...'
		});
		var postData = {
			picture		: $scope.picture,
			store		: $scope.retailer,
			ean			: $rootScope.missingEan
		};
		console.log(postData);
		$http({
			method  : 'POST',
			crossDomain: true,
			data    : $.param(postData),
			url     : serviceUrl+'missingProduct'+sha,
			headers	: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		}).success(function(data){
			$scope.picture = null;
			$scope.retailer = null;
			$ionicLoading.hide();
			$ionicPopup.show({
				title: 'Foto uploaden voltooid',
				template: 'Het uploaden van jouw foto is voltooid. Één van onze medewerkers zal de foto analyseren en het product proberen toe te voegen aan ons systeem.',
				 buttons: [
				 	{
				 		text:'Sluiten',
				 		type: 'bgGreen',
				 		onTap: function(e){
					 		$scope.$parent.$parent.eanModal.hide();
					 	}
				 	}
				 ]
			});
		});
	};
	
})

.controller('AccCtrl', function($scope, $ionicScrollDelegate){
	$scope.toggleAccordion = function(index){
		if ($scope.isAccActive(index)) {
			$scope.activeAcc = null;
		} else {
			$scope.activeAcc = index;
		}
		$ionicScrollDelegate.$getByHandle('scroll').resize();
	};
	$scope.isAccActive = function(group) {
    	return $scope.activeAcc === group;
	};
})

.controller('TabsCtrl', function($scope, $ionicScrollDelegate){
	$scope.currentTab = 0;
	
	$scope.setTabActive = function(index){
		$scope.currentTab = index;
	};
	
});
