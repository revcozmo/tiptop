// Generates random gameTable objects, colorLists and amount of clicks you need to solve the level
  app.factory('generator', function() {

    // INTERFACE
      var interface = {
        createNewLevel : function(rules) {
          var levelObj = {
            "level" : {
              "table"  : [],
              "colors" : []
            },
            "clicks" : 0,
          };

          // Some fucking crazy cool code


          return levelObj;
        },
      };

      return interface;
  })
