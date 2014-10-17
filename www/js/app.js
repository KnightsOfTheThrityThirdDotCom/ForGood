angular.module('forgood', ['ionic', 'forgood.controllers', 'forgood.services', 'forgood.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(typeof analytics !== "undefined") {
    	analytics.startTrackerWithId('UA-53703923-1');
    } else {
	    console.log('no GA');
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html"
    })
    
    .state('create-account', {
      url: "/create-account",
      templateUrl: "templates/account-create.html"
    })
    
    .state('forgot-password', {
      url: "/forgot-password",
      templateUrl: "templates/forgot-password.html"
    })
    
    .state('account-mobility', {
      url: "/account-mobility",
      templateUrl: "templates/account-mobility.html"
    })
    
    .state('account-energy', {
      url: "/account-energy",
      templateUrl: "templates/account-energy.html"
    })
    
    .state('account-monitor', {
      url: "/account-monitor",
      templateUrl: "templates/account-monitor.html"
    })
    
    .state('progress', {
      url: "/progress",
      templateUrl: "templates/progress.html"
    })
    
     .state('updateMobility', {
      url: "/update-mobility",
      templateUrl: "templates/update-mobility.html"
    })
    
    .state('product', {
      url: "/product",
      templateUrl: "templates/product.html"
    })
    
    .state('bill', {
      url: "/bill",
      templateUrl: "templates/bill.html"
    })
    
    .state('reset-mobility', {
      url: "/reset-mobility",
      templateUrl: "templates/reset-mobility.html"
    })
    
    .state('logout', {
      url: "/logout",
      templateUrl: "templates/logout.html"
    });

	if(window.localStorage.user){
		var user = JSON.parse(window.localStorage.user);
	}
		
	if(window.localStorage.user && user.nulmeting){
		$urlRouterProvider.otherwise('/progress');
	} else if (window.localStorage.user && user.nulmeting === 0){
		$urlRouterProvider.otherwise('/account-mobility');
	} else {
		$urlRouterProvider.otherwise('/login');
	}
});

