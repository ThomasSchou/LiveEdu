import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, VolumeOff, VolumeHigh, Fullscreen } from '../Assets'

import "../Styles/player.css";
import Quiz from "./Quiz";




const StreamPlayer = ({ playback, status, streamId }) => {
  const { IVSPlayer } = window;
  console.log(playback)
  let player = useRef(null)
  const videoEl = useRef(null);

  const [loading, setLoading] = useState(true)
  const [paused, setPaused] = useState(true)
  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

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
      playback
    );


    player.current.addEventListener(READY, onStateChange);
    player.current.addEventListener(PLAYING, onStateChange);
    player.current.addEventListener(ENDED, onStateChange);
    player.current.addEventListener(ERROR, onError);
    player.current.setVolume(volume)
    player.current.play()

    console.log(player)
    setPaused(false)

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
    console.log("Muting")
    const currentlMuteState = !player.current.isMuted()
    player.current.setMuted(currentlMuteState)
    setMuted(currentlMuteState)
  }

  const handleVolumeChange = (e) => {
    if (player.current.isMuted()) {
      player.current.setMuted(false)
      setMuted(false)
      console.log("forcing unmute")
    }

    let targetVol = parseFloat(e.target.value)
    player.current.setVolume(targetVol)
    setVolume(targetVol)
  }

  const handleFullscreen = () => {

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }

    setFullscreen(!fullscreen);
  };


  if (!IVSPlayer.isPlayerSupported || !player) {
    return "null";
  }

  console.log(player)
  console.log("muted: " + muted)
  return (
    <div className={"stream-container" + (fullscreen ? " fullscreen" : "")}>
      <Quiz streamId={streamId} />
      {<div className="stream-Controls">
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
          <div className="stream-volume-controls">
            {(muted || volume === 0) ? (
              <VolumeOff onClick={handleMute} className="stream-mute-btn" />
            ) : (
              <VolumeHigh onClick={handleMute} className="stream-mute-btn" />
            )}
            <input className="stream-volume-slider" type="range" min={0} max={1} step={0.01} defaultValue={volume} onChange={handleVolumeChange}></input>

          </div>

        </div>
        <div className="stream-controls-right">
          <Fullscreen onClick={handleFullscreen} className="stream-fullscreen-btn" />
        </div>
      </div>}

      <video id="stream-player" className="vjs-default-skin" ref={videoEl}></video>
    </div>
  );
}

export default StreamPlayer;