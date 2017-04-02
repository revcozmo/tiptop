// Controls the $scope not belonging to the game behaviour
  app.controller('viewCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup, $ionicPopover, cache, view, tool) {
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

    // Menu Popover
      $ionicPopover.fromTemplateUrl('templates/menuPopover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      // Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.popover.remove();
        });
      // Execute action on hidden popover
        $scope.$on('popover.hidden', function() {
          // Execute action
        });
      // Execute action on remove popover
        $scope.$on('popover.removed', function() {
          // Execute action
        });

    // Username popup; Username will be used for the global ranking
      $scope.enterName = function() {
        var namePopup = cache.getTranslation().namePopup;
        $ionicPopup.prompt({

          title: namePopup[0],
          template: namePopup[1],
          inputType: 'text',
          inputPlaceholder: namePopup[2]

        }).then(function(res) {

          if (res == undefined || res == "")
            return;

          alert("Name: " + res);

        });
      }


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
