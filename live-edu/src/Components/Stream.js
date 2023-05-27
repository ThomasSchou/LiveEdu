import React, { useEffect, useState, useRef } from "react";
import { registerIVSTech } from 'amazon-ivs-player';

import { Play, Pause} from '../Assets'

import BasePlayer from "./BasePlayer";
import StreamControls from "./StreamControls";
import { CONTROLS, POSITION } from "../Config/Config.js";

import "../Styles/player.css";



const Stream = ({ playerData }) => {


  const videoEl = useRef(null);
  const [currentPlayer, setCurrentPlayer] = useState(null)


  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://player.live-video.net/1.2.0/amazon-ivs-player.min.js";
    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      const { IVSPlayer } = window;
      if (IVSPlayer.isPlayerSupported) {
        console.info("player is supported");
        const player = IVSPlayer.create();
        player.attachHTMLVideoElement(document.getElementById("stream-player"));
        player.load(
          "https://a30460b2864f.eu-central-1.playback.live-video.net/api/video/v1/eu-central-1.279688390394.channel.arnU22p4Umes.m3u8"
        );
        player.play();
        console.log(player)
        playerData(player)

      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
      <video id="stream-player" className="vjs-default-skin" ref={videoEl} autoPlay></video>
  );
}

export default Stream;