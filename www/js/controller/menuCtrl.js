// Controls the $scope belonging to the popover menu
  app.controller('menuCtrl', function($scope, $ionicModal, $ionicPopup, cache, menu) {
    // Ranking Modal
      $ionicModal.fromTemplateUrl('templates/rankingModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.openModal = function() {
        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
      // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });
      // Execute action on remove modal
        $scope.$on('modal.removed', function() {
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

          var nameNotTaken = menu.requireUsernameEntry(res);

        });
      }
  })
