app.factory('menu', function(database) {
  // Subroutines

  // Interface
    var interface = {
      // Requires new username entry in database
      // This function writes a new username to the database and waits for firebase functions to check wether it's already taken; if so it returns false; if not it will return true
        requireUsernameEntry: function(name) {
          // Current time in unix code
            var timestamp = moment().unix();
          // Writes an entry with an as false (not processed by firebase functions yet) marked username and a timestamp to avoid overwriting an existing requirement
            database.write("requiredUsernames/" + timestamp, { name : name, processed : false });

          // TODO Wait for firebase functions to check the username
          return true;
        },
    };

  return interface;
})
