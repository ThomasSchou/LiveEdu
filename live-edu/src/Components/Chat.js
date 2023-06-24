import { useState } from "react";
import "../Styles/chat.css";
import { database } from "../Services/Firebase";
import { collection, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

function Chat(streamId = 1) {

  const [chatInput, setChatInput] = useState(null)

  const chatQuery = query(collection(database, "Chat"));
  const [snapshot, loading, error] = useCollection(chatQuery);

  let data = []
  if (snapshot) {
    snapshot.forEach((doc) => {
      if (doc.data()) {
        data.push(doc.data)
      }
    })
  }



  const generateChat = () => {
    return <div className="chat-output-item">
      <div className="chat-output-item-name">Thomas Moothner:</div><div className="chat-output-item-text">This is a in fact not a test question about the livestream and how it work</div>
    </div>
  }

  const sendChat = (isQuestion) => {
    setChatInput("") 
  }

  const handleInputChange = (event) => {
    setChatInput(event.target.value);
  };

  return (
    <div className="chat-container">
      <div className="chat-output">
        {generateChat()}
      </div>
      <div className="chat-input">
        <input
          type="text"
          className="chat-input-text"
          value={chatInput}
          onChange={handleInputChange}
        />
        <div className="chat-input-buttons">
          <div onClick={() => { sendChat(false) }} className="chat-input-submit">Chat</div>
          <div onClick={() => { sendChat(true) }} className="chat-input-submit question">Spørgsmål</div>
        </div>

      </div>
    </div>
  );
}

export default Chat;