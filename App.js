// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getStorage,
  ref as ref_storage,
  uploadBytes,
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
        const clipName = prompt(
          "Enter a name for your sound clip?",
          "My unnamed clip"
        );

        const playEditEl = document.getElementById("playEdit");

        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");
        const uploadButton = document.createElement("button");
        uploadButton.textContent = "Upload";

        const clipInfoDiv = document.createElement("div");
        clipInfoDiv.classList.add("clipInfo");

        clipContainer.classList.add("clip");
        audio.setAttribute("controls", "");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";

        if (clipName === null) {
          clipLabel.textContent = "My unnamed clip";
        } else {
          clipLabel.textContent = clipName;
        }

        clipInfoDiv.appendChild(clipLabel);
        clipInfoDiv.appendChild(uploadButton);
        clipInfoDiv.appendChild(deleteButton);

        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipInfoDiv);

        playEditEl.appendChild(clipContainer);

        ////////////
        // Create a Blob object from the chunks
        var blob = new Blob(chunks, { type: "audio/wav" });

        ///////
        // place audio recorded onto page and add event handlers for buttons
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;

        uploadButton.addEventListener("click", function (e) {
          // clipName is name of the clip to be used...

          const fileName = clipName + ".wav";
          const voiceRef = ref_storage(storage, "audio/" + fileName);

          uploadBytes(voiceRef, blob).then((snapshot) => {
            console.log("Uploaded a blob or file!");
          });
        });

        deleteButton.addEventListener("click", function (e) {
          e.target.closest(".clip").remove();
        });

        /////////////////////////////////
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
