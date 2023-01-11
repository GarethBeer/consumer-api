import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, eventHubMessage): Promise<void> {
    const events = JSON.parse(eventHubMessage[0])
    context.log('HTTP trigger function processed a request.');
    context.log('hello', events)

    let responseMessage;
    context.res = {
        body: responseMessage
    };

};

export default httpTrigger;