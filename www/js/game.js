// Serves gameTable
  app.factory('game', function(cache, $rootScope) {
    // Interface
      return {
        // Gets new level
          newLevel : function() {
            // TODO FUCKING CRAZY RANDOM CALCULATION
            cache.newGameTable("test");
            this.update();
          },
        // Shows gameTable
          update : function() {
            $rootScope.buttonID   = 0;
            $rootScope.gameTable  = cache.getGameTable();
            $rootScope.clickCount = cache.getClicks();
            if(cache.getBlind()) {
              $rootScope.iconVisibility = "";
            } else
              $rootScope.iconVisibility = "visibility:hidden";
          }
      };
  })
