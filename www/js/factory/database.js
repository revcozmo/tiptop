app.factory('database', function() {
  // Subroutines

  // Interface
    var interface = {
      // Writes to database/path and overwrites old data at given path
        write: function(path, data) {
          firebase.database().ref(path).set(data);
        },
    };

  return interface;
})
