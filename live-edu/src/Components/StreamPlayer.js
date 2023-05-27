import React, { useEffect, useState, useRef } from "react";
import { Play, Pause } from '../Assets'



import BasePlayer from "./BasePlayer";
import StreamControls from "./StreamControls";
import { CONTROLS, POSITION } from "../Config/Config.js";

import "../Styles/player.css";
import Stream from "./Stream";



const StreamPlayer = () => {
  const { IVSPlayer } = window;

  let player = useRef(null)
  const videoEl = useRef(null);

  const [loading, setLoading] = useState(true)

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
      console.log(player.current.getBufferDuration())
      if (loading !== (playerState !== PLAYING)) {
        setLoading(playerState !== PLAYING);
      }
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
    console.log("huh")
    player.current.getBufferDuration()
    player.current.play();
  };

  const handlePause = () => {
    console.log(player.current.getBufferDuration())
    console.log("huh1")
    player.current.setVolume(1.0)
    player.current.pause();
  };

  if (!IVSPlayer.isPlayerSupported || !player) {
    return "null";
  }

  console.log(player)
  return (
    <div className="stream-container">
      {!loading && <div className="stream-Controls">
        <div className="stream-controls-left">
          <div className="stream-play-pause-btn">
            {player.current.isPaused() && <div onClick={handlePlay} className="stream-controls-btn"> <Play /> </div>}
            {!player.current.isPaused() && <div onClick={handlePause} className="stream-controls-btn"> <Pause /> </div>}
          </div>
          <div className="stream-volume"></div>
        </div>
      </div>}
      <video id="stream-player" className="vjs-default-skin" ref={videoEl}></video>
    </div>
  );
}

export default StreamPlayer;