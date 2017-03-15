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
        var table = [];

       // Returns a row of the new game table
        var row = function(a) {
          // Creates rowArray
            var array = [];
          // Adds single lines to the row
            for (var b = 0; b < size; b++) {
              array.push({ "pos"  : [a,b],
                           "color": color });
            }
          return array;
        };

       // Adds the rows to the game table
        for (var a = 0; a < size; a++) {
          table.push(row(a));
        }

       return table;
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
        changeColors = function(x,y,gameTable,colorList) {
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
              levelObj.level.colors = createColorList(rules.colors, availableColors);
            // Creating level in only one random color
              levelObj.level.table = createBlankLevel(levelObj.level.colors[0], rules.size);

         /*
          * STEP 2 : Shuffle the blank game table as often as rules.clicks demands or less (randomly)
          */
            // The variable shuffles garantees that the amount of loops is random but based on the rule file
            //  shuffles causes the loop to be done between half of rules.clicks (rounded upwards) and rules.clicks; all values of shuffle are equaly probable
              var half     = rules.clicks/2;
              var shuffles = Math.floor( ( Math.random() * (Math.floor(half) + 1) ) + Math.round(half) );
            for (var i = 1; i < shuffles+1; i++) {
              // Determine random position on gameTalbe
                var x = Math.floor( Math.random() * rules.size );
                var y = Math.floor( Math.random() * rules.size );
                levelObj.level.table = changeColors(x,y,levelObj.level.table,levelObj.level.colors);
            }

            // Saved how often gameTable was shuffeled -> minimal(?) amount of clicks needed for solving the level
              levelObj.clicks = i;


          return levelObj;
        },
      };

      return interface;
  })
