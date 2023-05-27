import React from "react";

import { CONTROLS } from "../Config/Config";
import { AspectRatio, Close, VolumeOff, VolumeUp } from "../Assets";

const StreamControls = (props) => {
  const { controls, muted, onClose, onMute, onResize } = props;

  const renderControl = (control, key) => {
    let Icon;
    let callback;

    switch (control) {
      case CONTROLS.close:
        Icon = Close;
        callback = onClose;
        break;
      case CONTROLS.mute:
        Icon = muted ? VolumeOff : VolumeUp;
        callback = onMute;
        break;
      case CONTROLS.resize:
        Icon = AspectRatio;
        callback = onResize;
        break;
      default:
        return null;
    }

    return (
      <button key={key} className="PlayerControls-button" onClick={callback}>
        <Icon />
      </button>
    );
  };

  return (
    <div className="PlayerControls">
      {controls.map((control, i) => renderControl(control, i))}
    </div>
  );
};

export default StreamControls;