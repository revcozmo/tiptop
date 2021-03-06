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
        var getPersonalisedData = function(path, file, useRoot, callback) {
          $ionicPlatform.ready(function() {
            if(ionic.Platform.platforms[0] == "browser") {

              if (useRoot == true) {

                console.log("Browser detected : Reading default settings from root");
                var response = {
                  result   : true,
                  response : getData(path + "/" + file)
                };

              } else {

                console.log("Browser detected : Unable to read data because useRoot=" + useRoot);
                var response = {
                  result : false,
                  response : { message : "BROWSER_NOT_COMPATIBLE_WITH_CORDOVA" }
                };

              }

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

                      // Checks root directory only if parameters true -> avoid searching for e.g. level history in root directory
                        if (useRoot == true) {
                          console.log("Reading default settings from root");

                          var response = {
                            result   : true,
                            response : getData(path + "/" + file)
                          };
                        } else {
                          var response = {
                            result   : false,
                            response : error
                          }
                        }

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
              if (ionic.Platform.platforms[0] == "browser") {

                console.log("Error: Editing file " + path + "/" + file + " not possible because cordova is not supported by browsers");

                var response = {
                  result   : false,
                  response : { message : "BROWSER_NOT_COMPATIBLE_WITH_CORDOVA" }
                };
                callback(response);

              } else {

                // Checks for directory
                  $cordovaFile.checkDir(storage, path)
                    .then(function(success) {
                      // Write file
                        write(storage, path, file, txt, callback);
                    }, function(error) {
                      // Create missing directory and writes file afterwards
                        createDir(error, storage, path, txt, callback);
                    });

              }
            });
        };

      // Removes files/directories/recursivly directories -> check the mode param
        var removeData = function(file, mode, callback) {
          $ionicPlatform.ready(function() {
            // Detects Browser
              if (ionic.Platform.platforms[0] == "browser") {

                console.log("Error: Deleting file or directory " + file + " not possible due to cordova incompatibility");

                var response = {
                  result : false,
                  response : { message : "BROWSER_NOT_COMPATIBLE_WITH_CORDOVABROWSER_NOT_COMPATIBLE_WITH_CORDOVA" }
                };

                callback(response);

              } else {

                var response = {
                  result   : false,
                  response : {}
                };

                switch(mode) {
                  case 0:
                    // Removes file
                      $cordovaFile.removeFile(storage, file)
                        .then(function(success) {
                          response.result   = true;
                          response.response = success;
                          console.log("Successfully deleted file or directory " + file);
                          callback(response);
                        }, function(error) {
                          response.result   = false;
                          response.response = error;
                          console.log("Error: Deleting file or directory " + file);
                          callback(response);
                        });
                    break;

                  case 1:
                    // Removes directory
                    $cordovaFile.removeDir(storage, file)
                      .then(function(success) {
                        response.result   = true;
                        response.response = success;
                        console.log("Successfully deleted file or directory " + file);
                        callback(response);
                      }, function(error) {
                        response.result   = false;
                        response.response = error;
                        console.log("Error: Deleting file or directory " + file);
                        callback(response);
                      });
                    break;

                  case 2:
                    // Removes all files and directories from desired location
                    $cordovaFile.removeRecursively(storage, file)
                      .then(function(success) {
                        response.result   = true;
                        response.response = success;
                        console.log("Successfully deleted file or directory " + file);
                        callback(response);
                      }, function(error) {
                        response.result   = false;
                        response.response = error;
                        console.log("Error: Deleting file or directory " + file);
                        callback(response);
                      });
                    break;

                  default:
                      response.result   = false;
                      response.response = { message : "UNKNOWN_MODE" }
                      callback(response);
                    break;
                }

              }
          });
        };

    // Interface
      return { getData, getPersonalisedData, setData, removeData };
  })
