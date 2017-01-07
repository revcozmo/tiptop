// Contains functions for reading and writing files
  app.factory('fileService', function($cordovaFile, $ionicPlatform) {
    // Directory where app is saved
    // If cordova plugin not supported, leave it out (e.g. in browser)
      var root;
      try {
          root = cordova.file.applicationDirectory;
      } catch(error) {
        root = "";
        console.log("cordova.file not supported : " + error);
      }

    // Directory where dynamic information are saved (like the settings)
    // If cordova plugin not supported, leave it out (e.g. in browser)
      var storage;
      try {
          storage = cordova.file.dataDirectory;
      } catch(error) {
        storage = "";
        console.log("cordova.file not supported : " + error);
      }

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
            //alert("Write : " + angular.toJson(response));
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
                //alert("createDir : " + angular.toJson(response));
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
            request.open('GET', root + file, false);
          request.send(null);

          var response = angular.fromJson(request.responseText);

          if(request.status != 200)
            console.log("GET " + root + file + " : " + response);

          console.log("GET " + root + file + " : " + angular.toJson(response));
          return response;
        };

      // Gets file from storage, if not existing or running in browser from root
        var getPersonalisedData = function(path, file, callback) {
          $ionicPlatform.ready(function() {
            if(ionic.Platform.platforms[0] == "browser") {
              console.log("Browser detected : Reading default settings");
              var response = {
                result   : true,
                response : getData(root + "/" + path + "/" + file)
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
                  console.log("ERROR: cordova read from " + storage + "/" + path + "/" + file + " : " + error);
                  // Gets information from static files in root directory if personalised file not found or is running in browser
                    if (error.message == "NOT_FOUND_ERR") {
                      console.log("Reading default settings");
                      var response = {
                        result   : true,
                        response : this.getData(root + "/" + path + "/" + file)
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
                      //alert("ckeckDir : " + angular.toJson(success));
                      write(storage, path, file, txt, callback);
                  }, function(error) {
                    // Create missing directory and writes file afterwards
                      //alert("ERROR ckeckDir : " + angular.toJson(error));
                      createDir(error, storage, path, txt, callback);
                  });
            });
        };

    // Interface
      return { getData, getPersonalisedData, setData };
  })
