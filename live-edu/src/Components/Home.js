import Chat from "./Chat";
import StreamPlayer from "./StreamPlayer";

function Home() {

  return (
    <div className="container">
      <StreamPlayer/>
      <Chat></Chat>
    </div>
  );
}

export default Home;