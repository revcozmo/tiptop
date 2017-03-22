// Controls the $scope not belonging to the game behaviour
  app.controller('viewCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, cache, view, tool) {
    // Shows/Hides the settings and help screens
      $scope.showScreen = function(screen) {
          switch(screen) {
            case "help":
              $ionicSideMenuDelegate.toggleLeft();
              break;
            case "settings":
              $ionicSideMenuDelegate.toggleRight();
              break;
          }

          if (screen == cache.getScreen())
            screen = "game";

          cache.setScreen(screen);
      };

    // Sets new language
      $scope.langChange = function(newLang) {console.log("Test");
        cache.setLang(newLang);
        view.update.lang();
      };

    // Toogles wether clickCount or points will be shown
      $scope.toggleScore = function() {
        if (cache.getScoreToggle()) {
          cache.setScoreToggle(false);
        } else {
          cache.setScoreToggle(true);
        }
        view.update.clicks();
      }
  })
