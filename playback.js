// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getStorage,
  ref as ref_storage,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-storage.js";

import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

////////////////////////////////////////////
// TODO:
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  storageBucket: "",
  databaseURL: "",
};

////////////////////////////////////////////

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);
const voiceRef = ref_storage(storage, "audio/myVoice.wav");

// test the firebase realtime database by writing to it:
set(ref(database, "test/thing02"), {
  id: "thing02",
  username: "Jo Jo",
  itemName: "OK",
  locationURL: "http://abc.xz",
});

function playBack() {
  // Create a new audio context
  var audioCtx = new AudioContext();

  // Create a source node
  var source = audioCtx.createBufferSource();

  getDownloadURL(voiceRef).then((url) => {
    // Fetch the file data as an array buffer
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        // Decode the audio data and assign it to the source node
        audioCtx.decodeAudioData(buffer, function (decodedData) {
          source.buffer = decodedData;
        });
      });
  });

  // Connect the source node to the destination (speakers)
  source.connect(audioCtx.destination);

  // Start playing the audio
  source.start();
}

let playButtonEl = document.getElementById("playButton");
playButtonEl.addEventListener("click", function (e) {
  playBack();
});
