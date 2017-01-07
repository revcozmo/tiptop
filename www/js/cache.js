// Coordinates the data transferring between storage and controllers and controllers and controllers
  app.provider('cache', function() {
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
     *  FUNCTIONS
     */
      // Interface
       this.$get = function(fileService) {
          return {
            // Initialises the variables with data from .json
              setup : function(callback) {
                        this.clickCount          = 0;
                        this.currentScreen       = "game";
                        this.cfg                 = fileService.getData("config.json");
                        this.buttonList          = {diffList:[], langList:[]};
                        this.buttonList.diffList = fileService.getData("settings/difficulty.json");
                        this.buttonList.langList = fileService.getData("settings/lang.json");
                        this.colorToIcon         = fileService.getData("settings/colorToIcon.json");
                        fileService.getPersonalisedData("settings", "settings.json", function(file) {
                                      this.sets       = file.response;
                                      console.log("this.sets defined");
                                      this.setTranslation();
                                      console.log("CACHE SETUP DONE");
                                      callback();
                                    }); // FIXME does allways use the presets on device
                      },
            // var : buttonList
              getListDiff : function() {return this.buttonList.diffList;},
              getListLang : function() {return this.buttonList.langList;},
              rmvList     : function() {this.buttonList = {};},
            // var : cfg
              getAuthor  : function() {return this.cfg.author;},
              getEMail   : function() {return this.cfg.email;},
              getThanks  : function() {return this.cfg.thanks;},
              getVersion : function() {return this.cfg.version;},
              getWeb     : function() {return this.cfg.web;},
              rmvCfg     : function() {this.cfg = {};},
            // var : clickCount
              getClicks : function() {return this.clickCount;},
              setClicks : function(i) {this.clickCount = i;},
            // var : currentScreen
              getScreen : function() {return this.currentScreen;},
              setScreen : function(newScreen) {this.currentScreen = newScreen;},
            // var : sets
              getBlind : function() {return this.sets.blind;}, // Must be converted to boolean, because it is saved as string
              getDiff  : function() {return this.sets.diff;},
              getLang  : function() {return this.sets.lang;},
              setBlind : function(newBlind) {
                          this.sets.blind = newBlind;
                          // Update settings.json
                            fileService.setData("settings", "settings.json", angular.toJson(this.sets));
                         },
              setDiff  : function(newDiff)  {
                          this.sets.diff  = newDiff;
                          // Update settings.json
                            fileService.setData("settings", "settings.json", angular.toJson(this.sets));
                         },
              setLang  : function(newLang)  {
                          this.sets.lang  = newLang;
                          this.setTranslation();
                          // Update settings.json
                            fileService.setData("settings", "settings.json", angular.toJson(this.sets));
                         },
            // var : colorToIcon
              getIconLibary : function() {return this.colorToIcon;},
            // var : translation
              getTranslation : function() {return this.translation;},
              setTranslation : function() {this.translation = fileService.getData("lang/" + this.getLang() + ".json");},
            // var : level
              getColorList : function() {return this.level.colors;},
              getGameTable : function() {return this.level.table;},
              newLevel     : function(levelName) {
                              this.level  = fileService.getData("level/" + this.getDiff() + "/" + levelName + ".json");
                              this.clickCount = 0;
                             },
              setGameTable : function(newGameTable) {this.level.table = newGameTable;},

          };
       };
  })
