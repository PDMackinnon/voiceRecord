# voiceRecord
simple audio record and playback via Firebase

Index.html provides a basic audio record interface, and App.js will perfom the recording and upload to Firebase storage

playback.html provides a basic audio play interface which uses playback.js to download and decode the audio from Firebase storage

App.css is shared for stylin the basic interfaces

cors.json provides Cross Origin Resource Sharing config for Firebase Staorage to allow the playback page to download the audio from the storage without restictions. Some configuration is also required on the Google Cloud for this to take effect (see firebase docs)

Both Javascript files require the Firebase config to be updated to reflect the Firebase project - see Firebase console for the required info for your project


