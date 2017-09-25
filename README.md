# TipTop

Hi, every one. Please don't mind, but I'm not planing to edit a proper README.
What you are seeing here is an ionic application designed as a little game providing you with small riddles for boring moments.

The reason why I don't edit a proper README is simple. I'm still student and have only little time for coding. So I have no time for a description, explanation or something else. Maybe I'll add a helpfull README in the (distant?) future.

If you wonder what it does exactly. Try it out; you'll need ngCordova, cordova-icon and cordova-splash. There two scripts in hooks/after_prepare for cordova-icon and cordova-splash which are executed when the app is build. They only run on unix; so if you don't have that, delete or change them. If you're not familiar with cordova-icon or -splash, it's not that important. You just won't have an icon or a splash screen on your device, if you leave these scripts out.
I included a bash script in the top directory called setup.sh and it does exactly what it sounds like. Run it with sudo and it installs all important programms for building the project. Provided that I haven't missed anything. This script runs also only on unix and it needs apt installed in order to work; so if you have windows, you must get this stuff by yourself.

I only tested it on android so far.

Good Luck
