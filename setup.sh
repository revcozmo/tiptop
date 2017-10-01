# Installation of important programms

# Install ngCordova
bower --allow-root install ngCordova

# Install cordova-icon
# Docs https://www.npmjs.com/package/cordova-icon
apt-get install imagemagick
npm install cordova-icon -g
# Install cordova-splash
# Docs https://www.npmjs.com/package/cordova-splash
npm install cordova-splash -g

# Plugins
sudo -E cordova plugin add cordova-plugin-app-version
sudo -E cordova plugin add cordova-plugin-admobpro
sudo -E cordova plugin add cordova-plugin-splashscreen
sudo -E cordova plugin add cordova-plugin-statusbar
sudo -E cordova plugin add ionic-plugin-keyboard
sudo -E cordova plugin add cordova-plugin-file

# SASS is missing
