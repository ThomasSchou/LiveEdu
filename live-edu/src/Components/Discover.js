import { useEffect, useState } from "react";
import { getStreams } from "../Services/IVSApi";


function Discover() {

    const [channels, setChannels] = useState(null)

    useEffect(() => {
        getStreams()
            .then(channels => {
                console.log('List of channels:', channels);
            })
            .catch(error => {
                console.error('An error occurred:', error);
            });
    }, []);

    return (
        <div className="container">

        </div>
    );
}

export default Discover;