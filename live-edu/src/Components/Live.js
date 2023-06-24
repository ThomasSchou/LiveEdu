import { useParams } from "react-router-dom";
import Chat from "./Chat";
import StreamPlayer from "./StreamPlayer";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../Services/Firebase";

function Live() {

    let { slug } = useParams();

    const [stream, setStream] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const streamQuery = query(
                collection(database, "Streams"),
                where("slug", "==", slug)
            );
                
            try {
                const streamSnapshot = await getDocs(streamQuery);
                console.log(streamSnapshot)
                streamSnapshot.forEach((doc) => {
                    if (doc.exists()) {
                        setStream(doc.data())
                    }
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, []);

    if(!stream) {return "loading..."}

    console.log(stream)

    return (
        <div className="container">
            <StreamPlayer playback={stream.playback} status={stream.status}/>
            <Chat></Chat>
        </div>
    );
}

export default Live;