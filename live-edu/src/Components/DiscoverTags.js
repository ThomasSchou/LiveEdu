import { useEffect, useState } from "react";
import { useCollection } from 'react-firebase-hooks/firestore';
import "../Styles/discover.css";
import { auth, database } from "../Services/Firebase";
import { collection, query, getDocs, where } from "firebase/firestore";
import { getStreams } from "../Services/IVSApi";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

function DiscoverTags() {

    const [user] = useAuthState(auth);

    const [liveChannels, setLiveChannels] = useState(null)
    const [upcomingChannels, setUpcomingChannels] = useState(null)
    const [tags, setTags] = useState(null)



    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                return;
            }
            const userQuery = query(collection(database, "Users"), where("userId", "==", user.uid));
            const userSnapshot = await getDocs(userQuery);

            let tempTags;
            userSnapshot.forEach((doc) => {
                if (doc.data().tags) {
                    tempTags = doc.data().tags;
                }
            });
            console.log(tags);
            setTags(tempTags);
        };

        fetchData();
    }, [user]);

    useEffect(() => {
        if (!tags) {
            return;
        }

        const fetchStreams = async () => {
            const streamQuery = query(collection(database, "Streams"), where("tags", "array-contains-any", tags));
            const streamSnapshot = await getDocs(streamQuery);

            let live = [];
            let upcoming = [];

            streamSnapshot.forEach((doc) => {
                if (doc.data()) {
                    if (doc.data().status === "live") {
                        live.push(doc.data());
                    }
                    if (doc.data().status === "upcoming") {
                        upcoming.push(doc.data());
                    }
                }
            });

            setLiveChannels(live);
            setUpcomingChannels(upcoming);
        };

        fetchStreams();
    }, [tags]);


    if (!liveChannels || !upcomingChannels) { return <>nada</> }

    const generateLiveItems = () => {
        return liveChannels.map((item) => {
            return <div className="discover-item">
                <Link to={"/live/" + item.slug}>
                    <div className="discover-item-image-container"><img className="discover-item-image"></img></div>
                    <div className="discover-item-info">
                        <img className="discover-item-portrait"></img>
                        <div className="discover-item-text">
                            <div className="discover-item-name">{item.name}</div>
                            <div className="discover-item-viewers">{item.viewers}</div>
                            <div className="discover-item-price">{item.price}</div>
                            {item.tags.map((tag) => {
                                return <div className="discover-item-tag">{tag}</div>
                            })}
                        </div>
                    </div>
                </Link>
            </div>

        })
    }

    const generateUpcomingItems = () => {
        console.log(upcomingChannels)
        return upcomingChannels.map((item) => {
            return <div className="discover-item">
                <Link to={"/live/" + item.slug}>
                    <div className="discover-item-image-container"><img className="discover-item-image"></img></div>
                    <div className="discover-item-info">
                        <img className="discover-item-portrait"></img>
                        <div className="discover-item-text">
                            <div className="discover-item-name">{item.name}</div>
                            <div className="discover-item-viewers">{item.viewers}</div>
                            <div className="discover-item-price">{item.price}</div>
                            <div className="discover-item-tags">
                                {item.tags.map((tag) => {
                                    return <div className="discover-item-tag">{tag}</div>
                                })}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        })
    }

    return (
        <div className="discover-container">
            <div className="discover-title">Your tags</div>
            {tags ? (
                <div className="discover-tags">
                    {tags.map((tag, index) => (
                        <div className="discover-tag" key={index}>
                            {tag}
                        </div>
                    ))}
                </div>
            ) : (
                <div>No tags found.</div>
            )}
            <div className="discover-title">LIVE</div>
            <div className="discover-grid">
                {generateLiveItems()}

            </div>
            <div className="discover-title">UPCOMING</div>
            <div className="discover-grid">
                {generateUpcomingItems()}

            </div>
        </div>
    );
}

export default DiscoverTags;