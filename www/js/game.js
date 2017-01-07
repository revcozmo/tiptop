// Serves gameTable
  app.factory('game', function(cache, $rootScope) {
    // Subroutines
      // Gets next color from the preset list
        var getNextColor = function(oldColor, colorList) {
          // Search for current color
            var i = 0;
            while(colorList[i] != oldColor) {i++;}
          // returns next color from the list
            return colorList[i+1];
        };
    // Interface
      return {
        // Gets new level
          newLevel : function() {
            // TODO FUCKING CRAZY RANDOM CALCULATION
            cache.newLevel("test");
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
          },
        // Changes Color of given button and its neighbours
          changeColors : function(pos) {
            // Gets current game table
              var gameTable = cache.getGameTable;
            // Saves position of button which was hit
              var x = pos[0];
              var y = pos[1];
            // Gets sequence of color changes
              var colorList = cache.getColorList();

            // Changes Color of hit button and its neighbours
              gameTable[x    ][y    ].color = this.getNextColor(gameTable[x    ][y    ].color, colorList);
              gameTable[x + 1][y    ].color = this.getNextColor(gameTable[x + 1][y    ].color, colorList);
              gameTable[x - 1][y    ].color = this.getNextColor(gameTable[x - 1][y    ].color, colorList);
              gameTable[x    ][y + 1].color = this.getNextColor(gameTable[x    ][y + 1].color, colorList);
              gameTable[x    ][y - 1].color = this.getNextColor(gameTable[x    ][y - 1].color, colorList);
            // Saves and "activates" changes done to gameTable
              cache.setGameTable(gameTable);
              game.update();
          },
        // Checks wether all buttons have the same color
          playerWon : function() {
            var gameTable   = cache.getGameTable();
            var firstButton = gameTable[0][0];

            // Compares every buttons color with the color of the button in the upper left corner
              for(a=0; a < gameTable.length; a++) {

                for(b=0; b < gameTable[a].length; b++) {
                    if (gameTable[a][b].color != firstButton.color) {
                      return false;
                    }
                  }

                }

            return true;
          }
      };
  })
