import React, { useEffect, useState } from "react";
import "../Styles/admin.css";
import { collection, doc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import { auth, database } from "../Services/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { isStreamActive } from "../Services/IVSApi";

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}


function Admin() {

  const [user] = useAuthState(auth);

  const [currentStream, setCurrentStream] = useState(null)
  const [userData, setuserData] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    tags: "",
    expectedLive: ""
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
          let difference = Math.abs(docDate.getTime() - currentDate.getTime())
          if (difference < closestDifference)
            closestDifference = difference
          tempCurrentStream = doc.data()
        }
      })

      console.log(tempCurrentStream)
      setCurrentStream(tempCurrentStream)
    };

    fetchData();
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Perform form submission logic using the formData state
    console.log(formData);
    console.log()
    // Add a new document in collection "cities"
    await setDoc(doc(database, "Streams", generateRandomString(10)), {
      name: formData.name,
      userId: user.uid,
      slug: userData.slug,
      userDisplayName: user.displayName,
      price: formData.price,
      tags: formData.tags,
      expectedLive: formData.expectedLive,
      status: "upcoming",
      playback: userData.playback
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
          <button className="admin-stream-current-golive ready">Go live</button>
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
      </div>
    </div>
  );
}

export default Admin;
