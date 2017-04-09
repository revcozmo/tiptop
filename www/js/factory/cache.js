// Coordinates the data transferring between storage and controllers and controllers and controllers
  app.factory('cache', function(fileService, generator) {
    /*
     *  VARIABLES
     */
      var clickCount;     // cache for click counter
      var targetClicks    // cache for amount of clicks the generator used for creating the level
      var currentScreen;  // cache for screen selection
      var cfg;            // cache for config.json
      var sets;           // cache for settings/settings.json
      var buttonList;     // cache for settings/difficulty.json, settings/lang.json
      var colorToIcon     // cache for settings/colorToIcon.json (link between shown color and needed icon)
      var translation;    // cache for en.json, ger.json, etc.
      var level;          // cache for level cofiguration
      var colorList;      // cache for sequence of color changes
      var levelStock;     // cache for amount of available levels per difficulty
      var levelRuleStock; // cache for amount of available rules for level generation per difficulty
      var points;         // cache for points player won in total
      var unfinshedLevel; // saves wether there is a level saved, which was not finished before App was started again

    /*
     *  Interface
     */
      var interface = {
          // var : buttonList
            getListDiff : function() {return buttonList.diffList;},
            getListLang : function() {return buttonList.langList;},
            rmvList     : function() {buttonList = {};},
          // var : cfg
            getAuthor  : function() {return cfg.author;},
            getEMail   : function() {return cfg.email;},
            getThanks  : function() {return cfg.thanks;},
            getVersion : function() {return cfg.version;},
            getWeb     : function() {return cfg.web;},
            rmvCfg     : function() {cfg = {};},
          // var : clickCount
            getClicks : function() {return clickCount;},
            setClicks : function(i) {clickCount = i;},
          // var : currentScreen
            getScreen : function() {return currentScreen;},
            setScreen : function(newScreen) {currentScreen = newScreen;},
          // var : colorToIcon
            getIconLibary : function() {return colorToIcon;},
            getAvailableColors : function() {
                                    // Extracts the list of supported colors out of the color to icon mapping in colorToIcon.json
                                      var iconLibary = interface.getIconLibary()
                                      var availableColors = [];

                                      var i = 0;
                                      for(i in iconLibary) {
                                        availableColors.push(iconLibary[i][0]);
                                      }

                                      return availableColors;
                                 },
          // var : finishedLevel
            getLevelStatus : function() {return finishedLevel;},
            setLevelStatus : function(status) {finishedLevel = status;},
          // var : level
            clearCurrentLevel : function(callback) {
                                  fileService.removeData("history/currentLevel.json", 0, callback);
                                },
            getColorList      : function() {return level.colors;},
            getGameTable      : function() {return level.table;},
            newLevel          : function(fileName) {
                                  /* OLD METHOD: Uses static level-files
                                  level      = fileService.getData("level/" + interface.getDiff() + "/" + fileName + ".json"); */

                                  /* NEW METHOD: Uses static level-rule-files for generating random levels */
                                    var rules    = fileService.getData("level/rules/" + interface.getDiff() + "/" + fileName + ".json");
                                    var levelObj = generator.createNewLevel(rules, interface.getAvailableColors());

                                    level        = levelObj.level;
                                    interface.setTargetClicks(levelObj.clicks);

                                  interface.setClicks(0);
                                },
            saveLevel         : function() {
                                  var levelObj        = {};
                                  levelObj.table      = this.getGameTable();
                                  levelObj.colors     = this.getColorList();
                                  levelObj.clickCount = this.getClicks();

                                  fileService.setData("history", "currentLevel.json", angular.toJson(levelObj), function(answer) {
                                    console.log("Saving current level to storage/history/currentLevel.json:\nSuccess: " + answer.result + "\n" + angular.toJson(answer.response));
                                  });
                                },
            setGameTable      : function(newGameTable) {level.table = newGameTable;},
            getLastLevel      : function(callback) {
                                  fileService.getPersonalisedData("history", "currentLevel.json", false, function(file) {
                                    if(file.result == true) {
                                      console.log("Got last played level");
                                      // If there's a saved level existing set the content of save-file as current level information
                                        level = angular.fromJson(file.response);
                                        interface.setClicks(level.clickCount);
                                        // Change finishedLevel to false so the app knows when setting up everything that it don't has to get a new level
                                          interface.setLevelStatus(false);
                                    } else {
                                      console.log("Error while getting last played level: " + file.response.message);
                                      // There's no save existing -> change finishedLevel to true so a new level is gotten when app is set up
                                        interface.setLevelStatus(true);
                                    }

                                    callback();
                                  });
                                },
          // var : sets
            getBlind : function() {return sets.blind;}, // Must be converted to boolean, because it is saved as string
            getDiff  : function() {return sets.diff;},
            getLang  : function() {return sets.lang;},
            getScoreToggle : function() {return sets.showClicks;},
            setBlind : function(newBlind) {
                        sets.blind = newBlind;
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets), function(answer) {});
                       },
            setDiff  : function(newDiff)  {
                        sets.diff  = newDiff;
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets), function(answer) {});
                       },
            setLang  : function(newLang)  {
                        sets.lang  = newLang;
                        this.setTranslation();
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets), function(answer) {});
                       },
            setScoreToggle : function(newValue) {
                            sets.showClicks = newValue;
                            // Update settings.json
                              fileService.setData("settings", "settings.json", angular.toJson(sets), function(answer) {});
            },
          // var : targetClicks
            getTargetClicks : function() {return targetClicks;},
            setTargetClicks : function(i) {targetClicks = i;},
          // var : translation
            getTranslation : function() {return translation;},
            setTranslation : function() {translation = fileService.getData("lang/" + interface.getLang() + ".json");},
          // var : levelStock
            getLevelStock : function() {return levelStock[interface.getDiff()];},
          // var : levelRuleStock
            getLevelRuleStock : function() {return levelRuleStock[interface.getDiff()];},
          // var : points
            addPoints : function(newValue) {
                          points = points + newValue;

                          // Save points to .json
                            fileService.setData("score", "points.json", angular.toJson(points), function(answer) {});
                        },
            getPoints : function() {return points;},
            calcPoints : function() {
              // Calculates points from needed clicks, from generator used clicks and difficulty
                var userClicks    = interface.getClicks();
                var targetClicks  = interface.getTargetClicks();
                var dif           = interface.getDiff();
                var size          = interface.getGameTable().length;
              // Used for defining largest and smallest possible points
              // Both values must be greater than zero
                var max = 1000;
                var min = 1000;
              // Used for adjusting the gradient of the formula
                var k = (1 - size + 5) / ( 2*max*  (targetClicks + size));
              // Used for moving the root along the axis
              // -> How far player can miss the targetClicks and still get positive points
              //    depends on gameTable size, difficulty and targetClicks
                var x = userClicks - targetClicks - 2 * (dif + 1) - (size - 3)*20;
              // Constants for rounding points to multiple of 10
                var b = 10;
              // Constant for shifting calculated points towards positive numbers
              // n < 0 points always positive
              // n = 0 not defined
              // n = 1 point calculation fair
              // n > 1 point calculation shifted in favour of player
              // n < 1 point calculation shifted not in favour of player
                var n = 1;
              // This formula assigns to every value of userClicks a value of points
              // If userClicks is less than targetClicks + a points will be positive
              // If userClicks is more than targetClicks + a points will be negative
                return Math.floor( ( min * (max + min) ) / ( min + max * ℯ^( (max + min)*k*x) ) - min / n  ) * b;

            },
          // Initialises the variables with data from .json and the apps version from the config.xml
            setup : function(callback) {
                      clickCount          = 0;
                      currentScreen       = "game";
                      cfg                 = fileService.getData("config.json");
                      if(window.cordova)
                        cordova.getAppVersion.getVersionNumber().then(function (version) {
                                                                    cfg.version = version;
                                                                  });
                      buttonList          = {diffList:[], langList:[]};
                      buttonList.diffList = fileService.getData("settings/difficulty.json");
                      buttonList.langList = fileService.getData("settings/lang.json");
                      colorToIcon         = fileService.getData("settings/colorToIcon.json");
                      levelStock          = fileService.getData("settings/levelStock.json");
                      levelRuleStock      = fileService.getData("settings/levelRuleStock.json");
                      interface.getLastLevel(function() {
                                  fileService.getPersonalisedData("settings", "settings.json", true, function(file) {
                                                sets  = file.response;

                                                fileService.getPersonalisedData("score", "points.json", false, function(file) {
                                                              if (file.result == true) {
                                                                points = file.response;
                                                              } else {
                                                                points = 0;
                                                              }

                                                              interface.setTranslation();
                                                              console.log("CACHE SETUP DONE");
                                                              callback();
                                                            });
                                              });
                                  });
                    },

      };

      return interface;
  })
