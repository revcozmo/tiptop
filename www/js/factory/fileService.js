// Contains functions for reading and writing files
  app.factory('fileService', function($cordovaFile, $ionicPlatform) {
    // cordovaFile shortcut for dataDirectory
      var storage;
      $ionicPlatform.ready(function() {
          // Directory where dynamic information are saved (like the settings)
          // If cordova plugin not supported, leave it out (e.g. in browser)
          try {
              storage = cordova.file.dataDirectory;
          } catch(error) {
              storage = "";
              console.log("cordova.file not supported : " + error);
          }
        });

    /*********************************************/
    /* FUNCTIONS                                 */
    /*********************************************/
      var write = function(storage, path, file, txt, callback) {
        $cordovaFile.writeFile(storage, path + "/" + file, txt, true)
          .then(function(success) {
            console.log("Write to file " + storage + "/" + path + "/" + file + " : " + angular.toJson(success));
            var response = {
              result   : true,
              response : success
            };
            callback(response);
          }, function(error) {
            console.log("ERROR: Write to file " + storage + "/" + path + "/" + file + " : " + angular.toJson(error));
            var response = {
              result   : false,
              response : error
            };

            callback(response);
          });
      };
      var createDir = function(error, storage, path, file, txt, callback) {
        // error is the return parameter of $cordovaFile.checkDir()
        // Create missing directory
          if(error.message == "NOT_FOUND_ERR") {
            $cordovaFile.createDir(storage, path)
              .then(function(success) {
                // Write file
                  write(storage, path, file, txt, callback);
              }, function(error) {
                console.log("ERROR: Creating directory " + storage + "/" + path + " : " + angular.toJson(error));
                var response = {
                  result   : false,
                  response : error
                };

                callback(response);
              });
        // Unexpected error when checking directory's existence
          } else {
            console.log("ERROR: Checking for path "+ storage + "/" + path + " : " + error);
          }
      };

      // Gets file from root
        var getData = function(file) {
          var request = new XMLHttpRequest();
          // Synchronous request
            request.open('GET', file, false);
          request.send(null);

          var response = angular.fromJson(request.responseText);

          if(request.status != 200)
            console.log("GET " + file + " : " + response);

          console.log("GET " + file + " : " + angular.toJson(response));
          return response;
        };

      // Gets file from storage, if not existing or running in browser from root
        var getPersonalisedData = function(path, file, callback) {
          $ionicPlatform.ready(function() {
            if(ionic.Platform.platforms[0] == "browser") {
              console.log("Browser detected : Reading default settings");
              var response = {
                result   : true,
                response : getData(path + "/" + file)
              };

              callback(response);

            } else {
              // Gets file.json in storage
              $cordovaFile.readAsText(storage, path + "/" + file)
                .then(function(success) {
                  console.log("cordova read from " + storage + "/" + path + "/" + file + " : " + success);
                  var response = {
                    result   : true,
                    response : angular.fromJson(success)
                  };
                  callback(response);
                }, function(error) {
                  console.log("ERROR: cordova read from " + storage + "/" + path + "/" + file + " : " + error.message);

                  // Gets information from static files in root directory if personalised file not found or is running in browser
                    if (error.message == "NOT_FOUND_ERR") {
                      console.log("Reading default settings");

                      var response = {
                        result   : true,
                        response : getData(path + "/" + file)
                      };
                    } else {
                      var response = {
                        result   : false,
                        response : error
                      };
                    }

                  callback(response);

                });
            }
          });
        };

      // Saves data to file
        var setData = function(path, file, txt, callback) {
            $ionicPlatform.ready(function() {
              // Checks for directory
                $cordovaFile.checkDir(storage, path)
                  .then(function(success) {
                    // Write file
                      write(storage, path, file, txt, callback);
                  }, function(error) {
                    // Create missing directory and writes file afterwards
                      createDir(error, storage, path, txt, callback);
                  });
            });
        };

    // Interface
      return { getData, getPersonalisedData, setData };
  })
