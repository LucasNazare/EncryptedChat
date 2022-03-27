import { useEffect, useState } from "react";

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder(setStream).then(setRecorder, console.error);
      }
      return;
    }
    // Manage recorder state.
    if (isRecording) {
      try {
        recorder.start();
      } catch (e) {
        requestRecorder(setStream).then(setRecorder, console.error);
      }
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e) => {
      let blob = e.data.slice(0, e.data.size, "audio/wav");
      setAudioBlob(blob);
      setAudioURL(URL.createObjectURL(blob));
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    stream
      .getTracks() // get all tracks from the MediaStream
      .forEach((track) => track.stop());
  };

  return [
    audioURL,
    setAudioURL,
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    setAudioBlob,
  ];
};

async function requestRecorder(setStream) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  setStream(stream);
  return new MediaRecorder(stream);
}
export default useRecorder;
