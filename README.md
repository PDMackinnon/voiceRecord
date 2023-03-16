# voiceRecord
simple audio record and playback via Firebase

This JavaScript code defines a function called `makeRecording()` that records audio from the user's microphone for 4 seconds, and then allows the user to name, play, delete, and upload the recorded audio clip.

Here's a breakdown of the code:

1. The `makeRecording()` function starts by requesting access to the user's microphone using `navigator.mediaDevices.getUserMedia({ audio: true })`.

2. If the microphone access is granted, a `MediaRecorder` object is created using the obtained audio stream.

3. An empty array called `chunks` is created to store the recorded audio data.

4. Event listeners are added to the `MediaRecorder` object:
   - The "dataavailable" event listener appends the recorded audio data to the `chunks` array.
   - The "stop" event listener is triggered when the recording stops. It prompts the user to enter a name for the audio clip, creates the necessary HTML elements to display the clip, and adds event listeners for the delete and upload buttons.

5. The recording starts with `recorder.start()`, and a progress bar is updated every 100 milliseconds to show the recording progress.

6. After 4 seconds, the recording stops, the progress bar is cleared, and the audio stream is stopped.

7. If there's an error while accessing the microphone, the error message is logged to the console.

The recorded audio clip can be played, deleted, or uploaded using the respective buttons. The upload functionality uses Firebase Storage (assuming the necessary Firebase SDKs are included and initialized) to store the audio file in the "audio" folder with the user-provided name.
