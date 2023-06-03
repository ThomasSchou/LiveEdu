import AWS from 'aws-sdk';
import * as IVS from "aws-sdk/clients/ivs";

const region = 'eu-central-1'; // Replace with your desired region

AWS.config.update({
    region,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

console.log(process.env.REACT_APP_AWS_SECRET_ACCESS_KEY)

const ivs = new IVS();

export const getChannels = async () => {
    try {
        const params = {
            maxResults: 100
        };

        const allChannels = [];

        let response;
        do {
            response = await ivs.listChannels(params).promise();
            allChannels.push(...response.channels);

            params.nextToken = response.nextToken;
        } while (response.nextToken);

        return allChannels;
    } catch (error) {
        console.error('Error retrieving channels:', error);
        throw error;
    }
};


export const getStreams = async () => {
    try {
        const params = {
            maxResults: 100
        };

        const allStreams = [];

        let response;
        do {
            response = await ivs.listStreams(params).promise();
            allStreams.push(...response.streams);
            params.nextToken = response.nextToken;

        } while (response.nextToken);

        return allStreams;
    } catch (error) {
        console.error('Error retrieving streams:', error);
        throw error;
    }
};
