// Generates random gameTable objects, colorLists and amount of clicks you need to solve the level
  app.factory('generator', function() {

    // var : levelObj.colors
      createColorList = function(colorListLength, colorList) {
        // List of in the level available colors; remember last item of list equals first item in the list
        // Gets the list of all supported colors and scrabbles them randomly
          colorList.sort(function(a, b){return 0.5 - Math.random()}); // Copied from https://www.w3schools.com/js/tryit.asp?filename=tryjs_array_sort_random on the 12th of March 2017 on 21:04
        // Shortens the lenght of colorList to the parameter given by rule file
          if (colorListLength > colorList.length) {
            colorListLength = colorList.length;
            console.log("ERROR: Rule-file error. Rule file demands more colors than supported.");
          }
          // splice() removes colorList.length-colorListLength elements after the colorListLenghts element -> cutting of the end of the array
            colorList.splice(colorListLength, colorList.length - colorListLength);
        // Adding the first item as last item to the list; game logic needs this for looping through the list in a cycle
          colorList.push(colorList[0]);

        return colorList;
      };

   // var : levelObj.table
     createBlankLevel = function(color, size) {
       // Creates game table array
        var table = newArray(size);

       // Returns a row of the new game table
        var row = function(a) {
          // Creates rowArray
            var array = newArray(size);
          // Adds single lines to the row
            for (var b = 0; b < size; b++) {
              array.push({ "pos"  : [a,b],
                           "color": color });
            }
        };

       // Adds the rows to the game table
        for (var a = 0; a < size; a++) {
          table.push(row(a));
        }
     };

     // COLOR CHANGES
      // Gets next color from the preset list; Copied from gameCtrl in game.js
        var getNextColor = function(oldColor, colorList) {
          // Search for current color
            var i = 0;
            while(colorList[i] != oldColor) {i++;}
          // returns next color from the list
           return colorList[i+1];
        };
      // Changes Color of given button and its neighbours; Copied from gameCtrl in game.js
        changeColors = function(x,y,gameTalbe,colorList) {
          // Changes Color of hit button and its neighbours
            try { gameTable[x + 1][y    ].color = getNextColor(gameTable[x + 1][y    ].color, colorList); } catch (error) {}
            try { gameTable[x - 1][y    ].color = getNextColor(gameTable[x - 1][y    ].color, colorList); } catch (error) {}
            try { gameTable[x    ][y + 1].color = getNextColor(gameTable[x    ][y + 1].color, colorList); } catch (error) {}
            try { gameTable[x    ][y - 1].color = getNextColor(gameTable[x    ][y - 1].color, colorList); } catch (error) {}
                  gameTable[x    ][y    ].color = getNextColor(gameTable[x    ][y    ].color, colorList);

          return gameTable;
        };


    // INTERFACE
      var interface = {
        createNewLevel : function(rules, availableColors) {
          var levelObj = {
            "level" : {
              "table"  : [],
              "colors" : []
            },
            "clicks" : 0,
          };

          /*
           *  STEP 1 : Creating already solved puzzle
           */
            // Creating a random colorList
              levelObj.level.colors = createColorList();
            // Creating level in only one random color
              levelObj.level.table = createBlankLevel(levelObj.colors[0], rules.size);

         /*
          * STEP 2 : Shuffle the blank game table as often as rules.clicks demands or less (randomly)
          */
            for (var i = 1; i < rules.clicks+1; i++) {
              // Determine random position on gameTalbe
                var x = Math.floor( Math.random() * size );
                var y = Math.floor( Math.random() * size );
                levelObj.level.table = changeColors(x,y,levelObj.level.table,levelObj.level.colors);

              // If i > (rules.click)/2, function allowed to exit randomly -> amount of clicks needed for solving the level at minimum is random
                if (i > (rules.clicks)/2) {
                  // Probability of exiting before for-loop is done is for all i the same (Path Rule: p = p_1 * p_2 * ....)
                  //    -> does not matter how large rules.clicks is, i can nearly reach the value of rules.clicks (especially for large rules.clicks) -> more diverse values of levelObj.clicks
                  //
                  // p_k is the probability of not exiting the shuffling-loop in the k^th loop (k is only counting the loops since i reached half the size of rules.clicks)
                  // This algorith ensures that the event of exiting the loop has the same probability at any time -> All values of levelObj.clicks between n and rules.clicks are equaly probable
                    var n   = Math.round(rules.clicks/2);
                    var k   = i - n;
                    var p_k = ( n - k )/( n + 1 - k );
                    if ( Math.random <= 1 - p_k )
                      break;
                }
            }

            // Saved how often gameTable was shuffeled -> minimal(?) amount of clicks needed for solving the level
              levelObj.clicks = i;


          return levelObj;
        },
      };

      return interface;
  })
