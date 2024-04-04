import React, { useState, useRef, useEffect } from "react";
import styles from "./AudioRecorder.module.css";
import WaveSurfer from "wavesurfer.js";

function AudioRecorder() {
  const [audioURL, setAudioURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const audioInputRef = useRef();
  const mediaRecorderRef = useRef();
  const [submittedAudioURL, setSubmittedAudioURL] = useState("");

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.start();
        setIsRecording(true);
        startTimer();

        const audioChunks = [];
        mediaRecorderRef.current.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = function () {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
        };
      } catch (err) {
        console.error("Error accessing the microphone:", err);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from actually submitting
    setSubmittedAudioURL(audioURL); // Set the submitted audio URL

    if (audioURL) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', audioURL, true);
      xhr.responseType = 'blob';

      xhr.onload = function () {
        if (this.status === 200) {
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(this.response);
          downloadLink.download = 'recorded_audio.wav';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      };

      xhr.send();
    }
  };

  const startTimer = () => {
    setTimer(0);
    const id = setInterval(() => {
      setTimer((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioURL(URL.createObjectURL(file));
    }
  };

  const waveformRef = useRef(null);
  const [waveSurfer, setWaveSurfer] = useState(null);

  useEffect(() => {
    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#007bff",
      progressColor: "#0056b3",
      cursorColor: "transparent",
      barWidth: 2,
      barRadius: 3,
      responsive: true,
      height: 100,
      normalize: true,
      hideScrollbar: true,
    });

    ws.on("ready", () => {
      console.log("WaveSurfer is ready");
      ws.play();
    });
    ws.on("error", (e) => {
      console.error("WaveSurfer error:", e);
    });

    setWaveSurfer(ws);

    return () => ws && ws.destroy();
  }, []); // Removed dependency on waveSurfer

  // useEffect(() => {
  //   if (waveSurfer && submittedAudioURL) {
  //     waveSurfer.load(submittedAudioURL);
  //     waveSurfer.on("ready", () => waveSurfer.play());
  //   }
  // }, [submittedAudioURL, waveSurfer]);

  const handleWaveform = () => {
    console.log('handleWaveform called');

    if (waveSurfer && submittedAudioURL) {
      console.log('loading url:', submittedAudioURL);

      waveSurfer.load(submittedAudioURL);

      waveSurfer.once('ready', () => {
        console.log('waveform ready');
        waveSurfer.play();
      });

      window.dispatchEvent(new Event('resize'));
    }
  };

  return (
    <div className={styles.audioRecorderContainer}>
      <div className={styles.buttonsContainer}>
        {isRecording ? (
          <button onClick={stopRecording} disabled={!isRecording}>
            Stop Recording
          </button>
        ) : (
          <button onClick={startRecording} disabled={isRecording}>
            Start Recording
          </button>
        )}
        <span className={styles.timer}>Timer: {timer}s</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleAudioFileChange}
          className={styles.audioInput}
        />
        {/* <button type="submit">Submit</button> */}
        <button accept="audio/*"
          onChange={handleAudioFileChange}
          className={styles.audioInput}>Submit & Download</button>
      </form>
      {submittedAudioURL && (
        <div className={styles.audioPlayer}>
          <audio controls src={submittedAudioURL}></audio>
        </div>
      )}

      {/* New buttons for Waveform and Spot Keyword */}
      <div className={styles.buttonsContainer}>
        {/* <button className={styles.waveformButton} onClick={handleWaveform}>
      
        </button> */}
        {/* <button className={styles.spotKeywordButton}>Spot Keyword</button> */}
      </div>

      {/* Waveform container */}
      <div id="waveform" ref={waveformRef}></div>
      
    </div>
  );
}

export default AudioRecorder;
