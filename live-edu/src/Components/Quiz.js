import { useEffect, useState } from "react";
import "../Styles/quiz.css";
import { auth, database } from "../Services/Firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import { generateRandomString } from "../Helpers/generate";
import { useAuthState } from "react-firebase-hooks/auth";

function Quiz({ streamId }) {

  console.log(streamId)
  const [data, setData] = useState(null)
  const [isOpen, setIsOpen] = useState(null)
  const [user] = useAuthState(auth);
  


  useEffect(() => {
    if (!streamId) return

    const subscribeToDatabase = () => {

      const unsub = onSnapshot(doc(database, "Quiz", streamId), (doc) => {
        console.log(doc.data())
        let tempData
        setData(doc.data())
      });

    };


    subscribeToDatabase()

  }, [streamId]);

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  if(!data) {return}

  const registerAnswer = async(answer) => {
    const chatId = generateRandomString(5)
    let dataRef = doc(database, "Quiz", streamId)

    let chatData = {
      [user.displayName]:
      {answer: answer}
    }

    await updateDoc(dataRef, chatData)
    setIsOpen(false)
  }

  const dataValues = Object.keys(data)
  console.log(dataValues)
  return (
    <div className="quiz-container">
      {dataValues.length !== 0 && <button onClick={handleClick} className="quiz-button">Quiz</button>}
      {isOpen && <div className="quiz-window">
        <div className="quiz-title">Test Quiz</div>
        <div className="quiz-question">
          <div className="quiz-question-title">{data.name}</div>
          <div className="quiz-question-answers">
            <div onClick={() => registerAnswer(data.answer01)} className="quiz-question-answers-item">{data.answer01}</div>
            <div onClick={() => registerAnswer(data.answer02)} className="quiz-question-answers-item">{data.answer02}</div>
            <div onClick={() => registerAnswer(data.answer03)} className="quiz-question-answers-item">{data.answer03}</div>
            <div onClick={() => registerAnswer(data.answer04)} className="quiz-question-answers-item">{data.answer04}</div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Quiz;