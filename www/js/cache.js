// Coordinates the data transferring between storage and controllers and controllers and controllers
  app.factory('cache', function(fileService) {
    /*
     *  VARIABLES
     */
      var clickCount;     // cache for click counter
      var currentScreen;  // cache for screen selection
      var cfg;            // cache for config.json
      var sets;           // cache for settings/settings.json
      var buttonList;     // cache for settings/difficulty.json, settings/lang.json
      var colorToIcon     // cache for settings/colorToIcon.json (link between shown color and needed icon)
      var translation;    // cache for en.json, ger.json, etc.
      var level;          // cache for level cofiguration
      var colorList;      // cache for sequence of color changes

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

          // var : level
            getColorList : function() {return level.colors;},
            getGameTable : function() {return level.table;},
            newLevel     : function(levelName) {
                            level  = fileService.getData("level/" + this.getDiff() + "/" + levelName + ".json");
                            clickCount = 0;
                           },
            setGameTable : function(newGameTable) {level.table = newGameTable;},
          // var : sets
            getBlind : function() {return sets.blind;}, // Must be converted to boolean, because it is saved as string
            getDiff  : function() {return sets.diff;},
            getLang  : function() {return sets.lang;},
            setBlind : function(newBlind) {
                        sets.blind = newBlind;
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets));
                       },
            setDiff  : function(newDiff)  {
                        sets.diff  = newDiff;
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets));
                       },
            setLang  : function(newLang)  {
                        sets.lang  = newLang;
                        this.setTranslation();
                        // Update settings.json
                          fileService.setData("settings", "settings.json", angular.toJson(sets));
                       },
          // var : translation
            getTranslation : function() {return translation;},
            setTranslation : function() {translation = fileService.getData("lang/" + this.getLang() + ".json");},
          // Initialises the variables with data from .json
            setup : function(callback) {
                      clickCount          = 0;
                      currentScreen       = "game";
                      cfg                 = fileService.getData("config.json");
                      buttonList          = {diffList:[], langList:[]};
                      buttonList.diffList = fileService.getData("settings/difficulty.json");
                      buttonList.langList = fileService.getData("settings/lang.json");
                      colorToIcon         = fileService.getData("settings/colorToIcon.json");
                      fileService.getPersonalisedData("settings", "settings.json", function(file) {
                                    sets  = file.response;
                                    interface.setTranslation();
                                    console.log("CACHE SETUP DONE");
                                    callback();
                                  });
                    },

      };

      return interface;
  })
