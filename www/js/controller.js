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
      $scope.langChange = function(newLang) {
        cache.setLang(newLang);
        view.update.lang();
      };
  })


// Controls game behaviour
    app.controller('gameCtrl', function($scope, cache, game) {
      // Sets new difficulty
        $scope.diffChange = function(newDiff) {
          cache.setDiff(newDiff);
          game.newLevel();
        };
      // Sets color blindness (true/false)
        $scope.blindChange = function(checked) {
          cache.setBlind(checked);
          game.update();
        };

      // Action after button of gameTable has been hit
        $scope.buttonHit = function(id) {
          alert(id[0] + " " + id[1]); // TODO remove alert
          // Changes color of button which was hit and its neighbours
            game.changeColors(id);
          // Checks if player wins
            if(game.playerWon())
              ;
              // TODO Game OVer
        };

      // Shows for every color unique icon (colorblindness option)
        $scope.colorToIcon = function(color) {
          var icons = cache.getIconLibary();
          var i     = 0;
          while(icons[i][0] != color) {i++;}
          return icons[i][1];
        }
    })
