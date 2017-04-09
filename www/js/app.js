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
    })
    .state('points', {
      url: '/help/points',
      templateUrl: 'templates/help/points.html'
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

      // Setup AdMob advertisement
        // select the right Ad Id according to platform
          var admobid = {};
          if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
            admobid = {
              banner: 'ca-app-pub-5598297994391926/6062785296' // or DFP format "/6253334/dfp_example_ad"
            };
          } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
            admobid = {
              banner: 'ca-app-pub-5598297994391926/6062785296' // or DFP format "/6253334/dfp_example_ad"
            };
          } else { // for windows phone
            admobid = {
              banner: 'ca-app-pub-5598297994391926/6062785296' // or DFP format "/6253334/dfp_example_ad"
            };
          }
        // Show ad banner
          // it will display smart banner at top center, using the default options
            var test = true;
            if(window.AdMob) AdMob.createBanner({
              adId: admobid.banner,
              position: AdMob.AD_POSITION.TOP_CENTER,
              autoShow: true,
              isTesting: test
            });
            if (test)
              alert("The advertisement is running in test mode.");

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
