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

                let tempCurrentStream
                let currentDate = new Date()
                let closestDifference

                streamSnapshot.forEach((doc) => {
                    if (doc.data().status === "live") {
                        tempCurrentStream = doc.data()
                        return
                    }
                    if (doc.data()) {
                        let docDate = new Date(doc.data().expectedLive)
                        let difference = Math.abs(docDate.getTime() - currentDate.getTime())
                        if (difference < closestDifference || !closestDifference) {
                            closestDifference = difference
                            tempCurrentStream = doc.data()
                        }
                    }
                })
                console.log(tempCurrentStream)
                setStream(tempCurrentStream)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    if (!stream) { return "loading..." }

    console.log(stream)

    return (
        <div className="container">
            <StreamPlayer playback={stream.playback} status={stream.status} streamId={stream.streamId} />
            <Chat streamId={stream.streamId} />
        </div>
    );
}

export default Live;