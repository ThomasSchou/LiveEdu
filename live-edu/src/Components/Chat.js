import { useEffect, useState } from "react";
import "../Styles/chat.css";
import { auth, database } from "../Services/Firebase";
import { Firestore, addDoc, collection, doc, onSnapshot, query, setDoc, updateDoc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { generateRandomString } from "../Helpers/generate";
import { useAuthState } from "react-firebase-hooks/auth";

function Chat({ streamId }) {

  const [chatInput, setChatInput] = useState(null)
  const [data, setData] = useState(null)

  const [user] = useAuthState(auth);



  useEffect(() => {
    if (!streamId) return

    const subscribeToDatabase = () => {

      const unsub = onSnapshot(doc(database, "Chat", streamId), (doc) => {

        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        console.log(source, " data: ", doc.data());
        let tempData
        setData(doc.data())
      });

    };


    subscribeToDatabase()

  }, [streamId]);



  const generateChat = () => {
    if (!data) { return }

    const values = Object.values(data)
    console.log(values)

    const sortedValues = values.sort((a, b) => {
      const createdAtA = a.createdAt;
      const createdAtB = b.createdAt;
      
      if (createdAtA < createdAtB) {
        return 1; // 'a' comes before 'b'
      } else if (createdAtA > createdAtB) {
        return -1; // 'a' comes after 'b'
      } else {
        return 0; // 'a' and 'b' are equal
      }
    });
    console.log(sortedValues)

    return values.map((item) => {
      return <div className={"chat-output-item" + (item.isQuestion ? " question" : "")}>


        <div className="chat-output-item-name">{item.name}: </div><div className="chat-output-item-text">{item.text}</div>

      </div>
    })

  }

  const sendChat = async (isQuestion) => {
    const chatId = generateRandomString(5)
    let dataRef = doc(database, "Chat", streamId)
    let chatData = {
      [chatId]: {
        name: user.displayName,
        text: chatInput,
        isQuestion: isQuestion,
        createdAt: Date.now()
      }
    }

    await updateDoc(dataRef, chatData)
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
          <div onClick={() => sendChat(false)} className="chat-input-submit">Chat</div>
          <div onClick={() => sendChat(true)} className="chat-input-submit question">Spørgsmål</div>
        </div>

      </div>
    </div>
  );
}

export default Chat;