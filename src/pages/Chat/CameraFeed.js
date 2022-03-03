import React, { Component } from "react";

export class CameraFeed extends Component {
  /**
   * Processes available devices and identifies one by the label
   * @memberof CameraFeed
   * @instance
   */
  constructor(props) {
    super(props);
    this.state = { photoTaken: null };
  }
  processDevices(devices) {
    let cameras = [];
    devices.forEach((device) => {
      this.setDevice(device);
    });
    if (cameras.length === 0) {
      alert("Camera do dispositivo nao encontrada.");
      this.props.setCameraOn(false);
    }
  }

  /**
   * Sets the active device and starts playing the feed
   * @memberof CameraFeed
   * @instance
   */
  async setDevice(device) {
    try {
      const { deviceId } = device;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { deviceId },
      });
      this.videoPlayer.srcObject = stream;
      this.videoPlayer.play();
      return deviceId;
    } catch (e) {
      let i = 0;
    }
  }

  /**
   * On mount, grab the users connected devices and process them
   * @memberof CameraFeed
   * @instance
   * @override
   */
  async componentDidMount() {
    try {
      const cameras = await navigator.mediaDevices.enumerateDevices();
      this.processDevices(cameras);
    } catch (e) {
      console.log(e);
      this.props.setCameraOn(false);
    }
  }

  /**
   * Handles taking a still image from the video feed on the camera
   * @memberof CameraFeed
   * @instance
   */
  takePhoto = () => {
    const { sendFile } = this.props;
    const context = this.canvas.getContext("2d");
    context.drawImage(this.videoPlayer, 0, 0, 680, 360);
    this.canvas.toBlob(sendFile);
  };

  render() {
    return (
      <div className="c-camera-feed" style={{ position: "absolute" }}>
        {!this.state.photoTaken && (
          <div className="c-camera-feed__viewer">
            <video
              ref={(ref) => (this.videoPlayer = ref)}
              style={{ width: "100vw", height: "100vh" }}
            />
            )
          </div>
        )}
        <button onClick={this.takePhoto}>Take photo!</button>
        {!this.state.photoTaken && (
          <div className="c-camera-feed__stage">
            <canvas
              style={{ width: "100vw", height: "100vh" }}
              ref={(ref) => (this.canvas = ref)}
            />
          </div>
        )}
      </div>
    );
  }
}
