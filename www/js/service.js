// Contains useful functions
  app.factory('tool', function() {
    // Interface
      return {
        // Sleep function; causes a delay in code execution
          sleep : function(milliseconds) {
            var start = new Date().getTime();
              for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                  break;
               }
             }
          }
     };
  })
