import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, VolumeOff, VolumeHigh } from '../Assets'

import "../Styles/player.css";




const StreamPlayer = () => {
  const { IVSPlayer } = window;

  let player = useRef(null)
  const videoEl = useRef(null);

  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const { ENDED, PLAYING, READY } = IVSPlayer.PlayerState;
    const { ERROR } = IVSPlayer.PlayerEventType;

    if (!IVSPlayer.isPlayerSupported) {
      console.warn(
        'The current browser does not support the Amazon IVS player.',
      );

      return;
    }

    const onStateChange = () => {
      const playerState = player.current.getState();

      console.log(`Player State - ${playerState}`);
      setLoading(playerState !== PLAYING);
    };

    const onError = (err) => {
      console.warn('Player Event - ERROR:', err);
    };

    player.current = IVSPlayer.create();
    player.current.attachHTMLVideoElement(videoEl.current);
    player.current.load(
      "https://a30460b2864f.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.279688390394.channel.arnU22p4Umes.m3u8"
    );
    player.current.play()

    console.log(player)

    player.current.addEventListener(READY, onStateChange);
    player.current.addEventListener(PLAYING, onStateChange);
    player.current.addEventListener(ENDED, onStateChange);
    player.current.addEventListener(ERROR, onError);

    return () => {
      player.current.removeEventListener(READY, onStateChange);
      player.current.removeEventListener(PLAYING, onStateChange);
      player.current.removeEventListener(ENDED, onStateChange);
      player.current.removeEventListener(ERROR, onError);
    };
  }, []);



  const handlePlay = () => {
    console.log("Playing")
    player.current.play();
    setPaused(false)
  };

  const handlePause = () => {
    console.log("Pausing")
    player.current.pause();
    setPaused(true)
  };

  const handleMute = () => {
    player.current.setMuted()
    setMuted(true)
  }

  if (!IVSPlayer.isPlayerSupported || !player) {
    return "null";
  }

  console.log(player)
  return (
    <div className="stream-container">
      {!loading && <div className="stream-Controls">
        <div className="stream-controls-left">
          <div className="stream-play-pause-btn">
            {paused ? (
              <div onClick={handlePlay} className="stream-controls-btn">
                <Play />
              </div>
            ) : (
              <div onClick={handlePause} className="stream-controls-btn">
                <Pause />
              </div>
            )}
          </div>
          <div className="stream-mute-btn" onClick={handleMute}>
            {muted ? (
                <VolumeOff />
            ) : (
                <VolumeHigh />
            )}
            <input className="stream-volume-slider" type="slider" min={0} max={1} step={0.01} value={volume}></input>
          </div>
        </div>
      </div>}
      <video id="stream-player" className="vjs-default-skin" ref={videoEl}></video>
    </div>
  );
}

export default StreamPlayer;