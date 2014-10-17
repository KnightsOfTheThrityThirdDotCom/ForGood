angular.module('forgood', ['ionic', 'forgood.controllers', 'forgood.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
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
    
    .state('account-mobility', {
      url: "/account-mobility",
      templateUrl: "templates/account-mobility.html"
    })
    
    .state('account-living', {
      url: "/account-living",
      templateUrl: "templates/account-living.html"
    })
    
    .state('account-monitor', {
      url: "/account-monitor",
      templateUrl: "templates/account-monitor.html"
    })
    
    .state('progress-total', {
      url: "/progress-total",
      templateUrl: "templates/progress-total.html"
    })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

