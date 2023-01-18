import { Context } from "@azure/functions";
import { containers } from "./configs";

export const createAppendBlob = async (event:any, container:string, blob:string) => {
    blob
    try {
      const stringData = "<Event>\n" + JSON.stringify(event);
      const newAppendBlobClient = containers(container).api.getAppendBlobClient(blob)
      await newAppendBlobClient.create();
      
    const result =  await newAppendBlobClient.appendBlock(stringData, stringData.length);
      return {
        statusCode:200,
        message: `${blob} created and event appended successfully`,
        fullResponse: result
      }
    } catch (error) {
      return {
        statusCode: error.statusCode,
        message: error.code,
        fullError: error

      }
    }
  }

export const addToAppendBlob = async (event:any, container:string, blob:string) => {

  
    const existingAppendBlobClient = containers(container).api.getAppendBlobClient(blob);

    const stringData = "<Event>\n" + JSON.stringify(event);

    try {
        await existingAppendBlobClient.appendBlock(stringData, stringData.length);

        return {
            statusCode: 200,
            message:'Event Appended Successfully'
        }
    } catch (error) {
        
        return {
            statusCode: error.statusCode,
            message: error.code,
            fullError: error
        }
    }
  }

  export const createContainer = async (container:string) => {
    const containerName = container;
    const containerClient = containers(containerName).container.getContainerClient(containerName)
  
    try {
      const createContainerResponse = await containerClient.create();
      const response = `Container ${container} was successfully created 😎`
        return {
            statusCode: 200,
            message: response,
            fullResponse: createContainerResponse
      }
    } catch (error) {
        return {
            statusCode: error.statusCode || 404,
            message: 'Container was not created',
            fullError: error
        }
    }
  }

export const listBlobs = async (container) => {
      const containerClient = containers(container).api;

    let i = 1;
    let blobs = containerClient.listBlobsFlat();
    let blobsArr = [];

    for await (const blob of blobs) {
        console.log(`Blob ${i++}: ${blob.name}`);
        blobsArr.push(blob.name)
    }
    return blobsArr;
  }

export const listContainers = async (container) => {
    let i = 1;
    let listOfContainers = await containers(container).container.listContainers();
    const containersArr = []
    for await (const container of listOfContainers) {
        containersArr.push(container.name)
        console.log(`container ${i++}: ${container.name}`);
    }
    return containersArr
  }