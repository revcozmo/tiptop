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
              levelObj.colors = createColorList();
            // Creating level in only one random color
              levelObj.table = createBlankLevel(levelObj.colors[0], rules.size);

         /*
          * STEP 2 : Shuffle the blank game table
          */


          return levelObj;
        },
      };

      return interface;
  })
