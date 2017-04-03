// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('app', ['ionic', 'ngCordova']);

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('index', {
      url: '/help',
      templateUrl: 'templates/help/main.html'
    })
    .state('about', {
      url: '/help/about',
      templateUrl: 'templates/help/about.html'
    })
    .state('rules', {
      url: '/help/rules',
      templateUrl: 'templates/help/rules.html'
    });

    $urlRouterProvider.otherwise("/help");
});

app.run(function($ionicPlatform, cache, view, game) {
  $ionicPlatform.ready(function() {
    try {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
      // Initialise cache's variables
        cache.setup(function() {
          // Sets the view up
            view.setup();
            view.update.all();
            // Deletes static information in cacheProvider
            cache.rmvCfg();
            cache.rmvList();
            // Gets new level, if there's no unfinished save existing; if there is just update the view of the gameTable, cos the unfinsished level is already loaded into the cache (->cache.setup())
              if(cache.getLevelStatus() == true)
                game.newLevel();
              else
                game.update();
            console.log("APP READY TO USE");
          });
    } catch(error) {
      console.log("Error in app.run() : " + error);
      alert("Error in app.run() : " + error);
    }
  });
})
