import { useState } from "react";
import "../Styles/quiz.css";

function Quiz(streamId) {

  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="quiz-container">
      <button onClick={handleClick} className="quiz-button">Quiz</button>
      {isOpen && <div className="quiz-window">
        <div className="quiz-title">Test Quiz</div>
        <div className="quiz-question">
          <div className="quiz-question-title">Spørgsmål 1</div>
          <div className="quiz-question-answers">
            <div className="quiz-question-answers-item">svar 1</div>
            <div className="quiz-question-answers-item">svar 2</div>
            <div className="quiz-question-answers-item">svar 3</div>
            <div className="quiz-question-answers-item">svar 4</div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Quiz;