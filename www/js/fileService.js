// Contains functions for reading and writing files
  app.factory('fileService', function($cordovaFile, fileSubService) {
    // Extends root path if app is used on android device
      var root = "";
      if(ionic.Platform.isAndroid())
        root = "/android_asset/www/";
    // Directory where dynamic information are saved (like the settings)
    // If cordova plugin not supported, leave it out (e.g. in browser)
      try {
        var storage = cordova.file.dataDirectory;
      } catch(error) {
        var storage = "'storage'";
        console.log("cordova.file.dataDirectory not supported : " + error);
      }

    // Interface
      return {
        // Gets file from storage, if not existing from root
          getPersonalisedData : function(path, file) {
            // Gets file.json in storage
              var response = fileSubService.getFromStorage(storage, path, file);
            // Gets file.json from root, if no personalised version in storage existing
              if(response)
                response = this.getData(path + "/" + file);
              console.log(angular.fromJson(response));

            return response;
          },
        // Gets file from root
          getData : function(file) {
            var request = new XMLHttpRequest();
            // Synchronous request
              request.open('GET', root + file, false);
            request.send(null);

            var response = angular.fromJson(request.responseText);

            if(request.status != 200)
              console.log("GET " + root + file + " : " + response);

            console.log("GET " + root + file + " : " + response);
            return response;
          },

        // Saves data to file
          setData : function(path, file, txt) {
            // Checks for directory
              fileSubService.checkDir(storage, path);

            // Write file
              $cordovaFile.writeFile(storage, path + file, txt, true)
                .then(function (success) {
                  console.log("Write to file " + storage + "/" + path + "/" + file + " : " + success);
                }, function (error) {
                  console.log("Write to file " + storage + "/" + path + "/" + file + " : " + error);
                });
          }
      };
  })

// Contains sub functions for fileService
  app.factory('fileSubService', function($cordovaFile, tool) {
    // Interface
      return {
        // Creates directory
          createDir : function(storage, path) {
            var response = $cordovaFile.createDir(storage, path)
                            .then(function(success) {
                              return true;
                            }, function(error) {
                              console.log("Creating directory " +storage + "/" + path + " : " + error);
                              return error;
                            });
            // Synchronises asynchronous request with the rest of the code
              while(!response)
                tool.sleep(100);

            return response;
          },

        // Checks for directory's existence
          checkDir : function(storage, path) {
            var response = $cordovaFile.checkDir(storage, path)
                            .then(function(success) {
                              return true;
                            }, function(error) {
                              if(error === "NOT_FOUND_ERR") {
                                // Creates dir if not found
                                  this.createDir(path);
                              } else
                                console.log("Checking for path "+ storage + "/" + path + " : " + error);
                                  return error;
                            });
            // Synchronises asynchronous request with the rest of the code
              while(!response)
                tool.sleep(100);

            return response;
          },

          // Gets file from storage
            getFromStorage : function(storage, path, file) {
              var response = $cordovaFile.readAsText(storage, file)
                              .then(function(success) {
                                alert(success);
                                return angular.fromJson(success); // FIXME response does not equal return param
                              }, function(error) {
                                console.log("cordova read from " + storage + "/" + path + "/" + file + " : " + error);
                                return "ERROR";
                              });
              // Synchronises asynchronous request with the rest of the code
                while(!response)
                  tool.sleep(100);

              return response;
            }
      };
  })
