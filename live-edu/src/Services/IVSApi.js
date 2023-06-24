import AWS from 'aws-sdk';
import * as IVS from "aws-sdk/clients/ivs";

const region = 'eu-central-1'; // Replace with your desired region

AWS.config.update({
    region,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

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

export const createChannel = async (channelName) => {
    try {
      // Check if channel with the same name already exists
      const existingChannel = await getChannelByName(channelName);
      if (existingChannel) {
        throw new Error('Channel with the same name already exists');
      }
  
      const params = {
        latencyMode: 'NORMAL', // Set the latency mode according to your requirements
        name: channelName.replace(/\s/g, '-').toLowerCase(), // Use the provided channel name
        type: "BASIC"
      };
  
      const response = await ivs.createChannel(params).promise();
      return response; // Return the ARN of the created channel
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  };
  
  // Helper function to get a channel by name
  const getChannelByName = async (channelName) => {
    try {

      const params = {
        filterByName: channelName.replace(/\s/g, '-').toLowerCase(),
      };
  
      const response = await ivs.listChannels(params).promise();
      if (response.channels.length > 0) {
        return response.channels[0];
      }
  
      return null;
    } catch (error) {
      console.error('Error retrieving channel:', error);
      throw error;
    }
  };

  export const isStreamActive = async (streamArn) => {
    try {
      const params = {
        arn: streamArn,
      };
      console.log("test")
      const response = await ivs.getStream(params).promise();
      return response.stream.state === 'ACTIVE';
    } catch (error) {
      console.error('Error retrieving stream:', error);
      throw error;
    }
  };