// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getStorage,
  ref as ref_storage,
  uploadBytes,
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

let userId;

const auth = getAuth();
signInAnonymously(auth)
  .then(() => {
    // Signed in..
    console.log("signed in");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;

        userId = uid;

        let timeNow = JSON.stringify(new Date());
        set(ref(database, "users/" + uid), {
          authorised: timeNow,
        });

        // ...
      } else {
        // User is signed out
        // ...
        console.log("signed out");
      }
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });

// test the firebase realtime database by writing to it:
set(ref(database, "test/thing01"), {
  id: "thing01",
  username: "Jo Smith",
  itemName: "Hello",
  locationURL: "http://xyz.co",
});

function makeRecording() {
  // Get a stream from the microphone
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
      // Create a new MediaRecorder
      var recorder = new MediaRecorder(stream);
      // Create an array to store the chunks of data
      var chunks = [];
      // Listen for dataavailable event
      recorder.addEventListener("dataavailable", function (e) {
        // Append the chunk to the array
        chunks.push(e.data);
      });
      // Listen for stop event
      recorder.addEventListener("stop", function () {
        // Create a Blob object from the chunks
        var blob = new Blob(chunks, { type: "audio/wav" });

        // Upload the Blob object to Firebase
        uploadBytes(voiceRef, blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
      });
      // Start recording
      recorder.start();
      const progressEl = document.getElementById("progress");
      progressEl.value = 0;
      let progressInterval = setInterval(function () {
        progressEl.value += 100 / 40;
      }, 100);

      setTimeout(function () {
        clearInterval(progressEl);
        recorder.stop();
        stream.getTracks()[0].stop();
      }, 4000); //stop after x seconds...
    })
    .catch(function (err) {
      console.log("The following getUserMedia error occurred: " + err);
    });
}

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
  //only works if the API is confirmed
  let startButton = document.getElementById("startButton");
  startButton.addEventListener("click", function (e) {
    makeRecording();
  });
}
