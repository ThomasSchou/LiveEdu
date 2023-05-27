import React from "react";

class BasePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.videoPlayer = React.createRef();
    this.player = null;
  }

  componentDidMount() {
    this.props.initializePlayer(this.videoPlayer.current);
  }

  componentWillUnmount() {
    // this.props.onPlayerDestroy(this.videoPlayer.current);
    // this.player.destroy();
  }

  render() {
    return (
      <video
        className="js-plyr plyr"
        playsInline
        ref={this.videoPlayer}
        style={{ width: "100%", height: "100%" }}
      />
    );
  }
}

export default BasePlayer;
