import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { addToAppendBlob, createAppendBlob, createContainer, listBlobs, listContainers } from "./utility-functions/utility-functions";

interface Event {
    eventType: string;
    eventTopic: string;
    subject: string;
    eventTime: string;
    data:any
}

const httpTrigger: AzureFunction = async function (context: Context, eventHubMessages): Promise<void> {

    const event = eventHubMessages[0]
    const [account, container, blob] = event.eventTopic.split('.');
    let result;

    context.log('HTTP trigger function processed a request.');
    context.log('event', event);

    context.log('calling append Blob')

    
    const listOfContainers = await listContainers(container);
    let listOfBlobs;
    if (listOfContainers.includes(container)) {
        listOfBlobs = await listBlobs(container);

        if (listOfBlobs.includes(blob)) {
             result = await addToAppendBlob(event, container, blob)
        } else {
            result = createAppendBlob(event, container, blob);
        }
         
    } else {
        context.log(`${container} not found in list of containers`, listOfContainers);
        context.log(`creating ${container}`)
        result = await createContainer(container);
        if (result.statusCode === 200) {
            context.log(`${container} created successfully now creating blob and appending event`)
            result = await createAppendBlob(event, container, blob);

            if(result.statusCode === 200){
                context.log('event appended successfully')
            }
        }
    }

    let responseMessage;
    context.res = {
        body: responseMessage
    };

};

export default httpTrigger;