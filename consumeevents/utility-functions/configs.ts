import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

const StorageConnString = process.env["AZURE_STORAGE_CONNECTION_STRING"]
const storageContainerName = (process.env["STORAGE_CONTAINER_NAME"] || '');  

if (!StorageConnString) {
    throw Error("Azure Storage Connection string not found");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(StorageConnString);

  export const containers = (containerName:string = '') => {
    return {
        api: blobServiceClient.getContainerClient(containerName || storageContainerName),
        container: blobServiceClient, 
    }
  };

