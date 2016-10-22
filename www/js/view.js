// Prints information
  app.factory('view', function(cache, $rootScope) {
    // Interface
      return {
        // Prints variable information (like the text translations)
          update : {
            lang    : function() {
              $rootScope.translation = cache.getTranslation();
            },
            clicks  : function() {
              $rootScope.clickCount  = cache.getClicks();
            },
            all     : function() {
              this.lang();
              this.clicks();
              console.log("VIEW UPDATE DONE");
            }
          },

        // Prints static information (like the author)
          setup : function() {
            $rootScope.author     = cache.getAuthor();
            $rootScope.version    = cache.getVersion();
            $rootScope.email      = cache.getEMail();
            $rootScope.thanks     = cache.getThanks();
            $rootScope.langList   = cache.getListLang();
            $rootScope.diffList   = cache.getListDiff();
            // Prechecks selected language, difficulty and colorBlindness
              $rootScope.langChoice = cache.getLang();
              $rootScope.diffChoice = cache.getDiff();
              $rootScope.blindList  = {checked : cache.getBlind()};
            console.log("VIEW SETUP DONE");
          },

      };
  })
