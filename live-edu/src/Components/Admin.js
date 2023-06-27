import React, { useEffect, useState } from "react";
import "../Styles/admin.css";
import { collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, database } from "../Services/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { isStreamActive } from "../Services/IVSApi";
import { generateRandomString } from "../Helpers/generate";



function Admin() {

  const [user] = useAuthState(auth);

  const [currentStream, setCurrentStream] = useState(null)
  const [userData, setuserData] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    tags: "",
    expectedLive: ""
  });
  const [quizData, setQuizData] = useState({
    name: "",
    answer01: "",
    answer02: "",
    answer03: "",
    answer04: ""
  });



  console.log(user?.displayName)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const userQuery = query(
        collection(database, "Users"),
        where("userId", "==", user.uid),

      );

      const userSnapshot = await getDocs(userQuery);

      let tempUser

      userSnapshot.forEach((doc) => {
        if (doc.data()) {
          tempUser = doc.data()
        }
      })

      console.log(tempUser)
      setuserData(tempUser)
    };

    fetchData();
  }, [user]);



  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const streamQuery = query(
        collection(database, "Streams"),
        where("userId", "==", user.uid),

      );

      const streamSnapshot = await getDocs(streamQuery);

      let tempCurrentStream
      let currentDate = new Date()
      let closestDifference

      streamSnapshot.forEach((doc) => {
        if (doc.data()) {
          let docDate = new Date(doc.data().expectedLive)
          console.log(docDate.getTime() + doc.data().name)
          let difference = Math.abs(docDate.getTime() - currentDate.getTime())
          console.log(difference)
          if (difference < closestDifference || !closestDifference) {
            closestDifference = difference
            tempCurrentStream = doc.data()
          }
        }
      })

      console.log(tempCurrentStream)
      setCurrentStream(tempCurrentStream)
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!currentStream) return

    const fetchData = async () => {
      const quizQuery = query(
        collection(database, "Quiz"),
        where("streamId", "==", currentStream.streamId),

      );

      const quizSnapshot = await getDocs(quizQuery);

      let tempQuiz

      quizSnapshot.forEach((doc) => {
        if (doc.data()) {
          tempQuiz = doc.data()
        }
      })

      console.log(tempQuiz)
      setQuiz(tempQuiz)
    };

    fetchData();
  }, [currentStream]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData);
    console.log()

    const trimmedTags = formData.tags.replace(/\s/g, '').toLowerCase().split(',')
    const streamId = generateRandomString(10)

    await setDoc(doc(database, "Streams", streamId), {
      streamId: streamId,
      name: formData.name,
      userId: user.uid,
      slug: userData.slug,
      userDisplayName: user.displayName,
      price: formData.price,
      tags: trimmedTags,
      expectedLive: formData.expectedLive,
      status: "upcoming",
      playback: userData.playback
    });

    await setDoc(doc(database, "Chat", streamId), {

    });

    // Reset the form after submission
    setFormData({
      name: "",
      price: "",
      tags: "",
      expectedLive: ""
    });
  };


  const getIVSStreamStatus = async () => {
    const isActive = await isStreamActive(user.channelArn);
    return isActive
  }

  const handleQuizInputChange = (event) => {
    const { name, value } = event.target;
    setQuizData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const submitQuiz = async () => {
    await setDoc(doc(database, "Quiz", currentStream.streamId), {
      streamId: currentStream.streamId,
      name: quizData.name,
      answer01: quizData.answer01,
      answer02: quizData.answer02,
      answer03: quizData.answer03,
      answer04: quizData.answer04,
    });

    setQuizData({
      name: "",
      answer01: "",
      answer02: "",
      answer03: "",
      answer04: ""
    })
  };

  const generateQuiz = () => {
    if (currentStream?.status === "upcoming") {
      return <div className="admin-stream-current">
        <div className="admin-stream-current-title">Quiz</div>
        <label className="admin-stream-form-label">Question</label>
        <input
          type="text"
          name="name"
          value={quizData.name}
          onChange={handleQuizInputChange}
          className="admin-stream-form-input"
        />
        <div className="quiz-grid">
          <div className="quiz-item">
            <label className="admin-stream-form-label">Answer 1</label>
            <input
              type="text"
              name="answer01"
              value={quizData.answer01}
              onChange={handleQuizInputChange}
              className="admin-stream-form-input"
            />
          </div>
          <div className="quiz-item">
            <label className="admin-stream-form-label">Answer 2</label>
            <input
              type="text"
              name="answer02"
              value={quizData.answer02}
              onChange={handleQuizInputChange}
              className="admin-stream-form-input"
            />
          </div>
          <div className="quiz-item">
            <label className="admin-stream-form-label">Answer 3</label>
            <input
              type="text"
              name="answer03"
              value={quizData.answer03}
              onChange={handleQuizInputChange}
              className="admin-stream-form-input"
            />
          </div>
          <div className="quiz-item">
            <label className="admin-stream-form-label">Answer 4</label>
            <input
              type="text"
              name="answer04"
              value={quizData.answer04}
              onChange={handleQuizInputChange}
              className="admin-stream-form-input"
            />
          </div>
        </div>
        {!quiz ? (
          <button onClick={submitQuiz} className="admin-stream-form-submit">
            Create Quiz
          </button>
        ) : (
          generateQuizData()
        )}
      </div >
    }

  }

  const generateQuizData = () => {
    if (!quiz) { return }

    const filteredObjects = Object.entries(quiz)
      .filter(([key, value]) => typeof value === 'object')
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
      console.log(filteredObjects)
    return (
      
      <>
        < button onClick={submitQuiz} className="admin-stream-form-submit">
          Replace Quiz
        </button>
        <div className="quiz-result">
          {Object.entries(filteredObjects).map(([key, value]) => {
            console.log(value); // Updated from `item` to `value`
            return (
              <div className="quiz-result-item">
                <div className="quiz-result-user">{key}</div>
                <div className="quiz-result-answer">{value.answer}</div>
              </div>
            );
          })
          }
        </div>
      </>)

  }

  const goLive = async () => {
    await updateDoc(doc(database, "Streams", currentStream.streamId), {
      status: "live"
    });

  }

  const getStreamStatus = () => {

    var streamState

    switch (currentStream?.status) {
      case undefined:
        streamState = "noPlanned";
        break;
      case "live":
        streamState = "live";
        break;
      case "upcoming":
        streamState = getIVSStreamStatus ? "waiting" : "ready";
        break;
    }

    switch (streamState) {
      case "ready":
        return <>
          <div className={"admin-stream-current-status active"}>Ready</div>
          <div className="admin-stream-current-explain">Ready to go live!</div>
          <button onClick={goLive()} className="admin-stream-current-golive ready">Go live</button>
        </>

      case "waiting":
        return (
          <>
            <div className={"admin-stream-current-status waiting"}>Waiting for stream</div>
            <div className="admin-stream-current-explain">Please go live on your preferred broadcasting platform</div>
            <button disabled className="admin-stream-current-golive">Go live</button>
          </>)



      case "live":
        return <>
          <div className={"admin-stream-current-status live"}>Live</div>
          <div className="admin-stream-current-explain">You are already live. Enjoy!</div>
          <button disabled className="admin-stream-current-golive">Go live</button>
        </>


      case "noPlanned":
        return <>
          <div className={"admin-stream-current-status noPlan"}>No planned stream</div>
          <div className="admin-stream-current-explain">Please plan a stream</div>
          <button disabled className="admin-stream-current-golive">Go live</button>
        </>
      default:
        return <>error</>
    }
    return 'waiting';
  };

  if (!userData) { return "loading" }

  return (
    <div>
      <div className="admin-container">
        <div className="admin-stream-form">
          <div className="admin-stream-form-title">Plan new stream</div>
          <label className="admin-stream-form-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="admin-stream-form-input"
          />
          <label className="admin-stream-form-label">Price</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="admin-stream-form-input"
          />
          <label className="admin-stream-form-label">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="admin-stream-form-input"
          />
          <label className="admin-stream-form-label">Expected Live</label>
          <input
            type="date"
            name="expectedLive"
            value={formData.expectedLive}
            onChange={handleInputChange}
            className="admin-stream-form-input"
          />
          <button onClick={handleSubmit} className="admin-stream-form-submit">
            Submit
          </button>
        </div>
        <div className="admin-stream-current">
          <div className="admin-stream-current-title">Your Stream</div>
          {currentStream && (
            <>
              <b>Name: </b> {currentStream.name}
              <b>Expected Live: </b> {currentStream.expectedLive}
            </>
          )}
          {getStreamStatus()}
        </div>
        <div className="admin-stream-current">
          <div className="admin-stream-current-title">Your Info</div>
          <b>Stream Key: </b>{userData.streamKey}
          <b>Ingest Server: </b> rtmps://a30460b2864f.global-contribute.live-video.net:443/app/
        </div>
        {generateQuiz()}
      </div>
    </div>
  );
}

export default Admin;
