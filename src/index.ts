/*Insert import here*/
import dotenv from "dotenv";
import {dateDescription, getDate} from "./tools/date/date";
import {getWeekNumber} from "./tools/weekNumber/weekNumber";
import promptSync from "prompt-sync";
import {googleSearchApi, googleSearchApiDescription} from "./tools/google/googleSearchApi";
import OpenAI from "openai";

import {
    generateAndRunJSCodeDescription,
    generateAndRunJsCode,
    generateAndRunJsCodeInDocker, runJSCodeInDockerDescription
} from "./tools/jsGenerator/jsGenerator";
import {generateAndRunPythonCode, generateAndRunPythonCodeDescription} from "./tools/pythonGenerator/pythonGenerator";
import {wakeUpCar, wakeUpCarDescription} from "./tools/tesla/wakeUpCar";
import {getCarInfo, getCarInfoDescription} from "./tools/tesla/getCarInfo";
import {getRefreshTokenDescription, getTeslaToken} from "./tools/tesla/getTeslaToken";
import {wikipediaSearchApi, wikipediaSearchApiDescription} from "./tools/wikipedia/wikipediaSearchApi";
import { sendLightCommandsToHomeAssistant, sendLightCommandsToHomeAssistantDescription } from "./tools/homeAssistant/homeAssistantLights";
import { getDomainsFromHomeAssistant, getDomainsFromHomeAssistantDescription } from "./tools/homeAssistant/homeAssistantGetDomains";
import { getDomainInfoFromHomeAssistant, getDomainInfoFromHomeAssistantDescription } from "./tools/homeAssistant/homeAssistantGetDomainInfo";
import {killSelf, killSelfDescription} from "./tools/killSelf/killSelf";
import fs from "fs";
import {writeNote, writeNoteDescription} from "./tools/notes/writeNote";
import {readNote, readNoteDescription} from "./tools/notes/readNote";
import {
    showFunctionsExample,
    showFunctionsExampleDescription
} from "./tools/showFunctionsExample/showFunctionsExample";
import {writeOpenAIFunction, writeOpenAIFunctionDescription} from "./tools/writeOpenAIFunction/writeOpenAIFunction";
dotenv.config()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({apiKey: OPENAI_API_KEY});

const toolsMapping = {
    /*Insert tool here*/
    get_week_number: getWeekNumber,
    get_date: getDate,
    google_search_api: googleSearchApi,
    //generate_and_run_js_code: generateAndRunJsCode,
    get_car_info: getCarInfo,
    wake_up_car: wakeUpCar,
    //generate_and_run_python_code: generateAndRunPythonCode,
    get_refresh_token_from_tesla: getTeslaToken,
    //run_js_code_in_docker: generateAndRunJsCodeInDocker,
    wikipedia_search_api: wikipediaSearchApi,
    send_light_commands_to_home_assistant: sendLightCommandsToHomeAssistant,
    get_domains_from_home_assistant: getDomainsFromHomeAssistant,
    get_domain_info_from_home_assistant: getDomainInfoFromHomeAssistant,
    kill_self: killSelf,
    write_note: writeNote,
    read_note: readNote,
    show_functions_example: showFunctionsExample,
    write_openai_function: writeOpenAIFunction
};
const tools = [
    /*Insert tool description here*/
    dateDescription,
    googleSearchApiDescription,
    //generateAndRunJSCodeDescription,
    //generateAndRunPythonCodeDescription,
    writeOpenAIFunctionDescription,
    wakeUpCarDescription,
    getCarInfoDescription,
    getRefreshTokenDescription,
    //runJSCodeInDockerDescription,
    wikipediaSearchApiDescription,
    sendLightCommandsToHomeAssistantDescription,
    getDomainsFromHomeAssistantDescription,
    getDomainInfoFromHomeAssistantDescription,
    killSelfDescription,
    writeNoteDescription,
    readNoteDescription,
    showFunctionsExampleDescription
];

const systemMessage = "You are an informative AI that helps user with different questions. You have been provided with different tools to help answer these questions.";

async function runQuery(query, messages) {
    console.log("<-------------------------Thinking----------------------------->");
    messages.push({role: "user", content: query});
    let toolNumber = 1;
    while (true) {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106", messages: messages, tools: tools as any, tool_choice: "auto",
        });
        const responseMessage = response.choices[0].message;
        const toolCalls = responseMessage.tool_calls;
        if (responseMessage.tool_calls) {
            messages.push(responseMessage);
            console.log("<-------------------------Calling tools----------------------------->")
            console.log("toolCalls.length: " + toolCalls.length);
            for (const toolCall of toolCalls) {
                console.log("---Calling tool number: " + toolNumber++);
                const functionToCallName = toolCall.function.name;
                const functionToCall = toolsMapping[functionToCallName];
                console.log(toolCall.function.arguments)
                const functionArgs = JSON.parse(toolCall.function.arguments);
                console.log(`---Calling function ${functionToCallName}`);
                console.log("---Function args ...:", functionArgs);
                const functionResponse = await functionToCall(functionArgs);
                console.log("---Function result ...:", functionResponse);
                messages.push({
                    tool_call_id: toolCall.id, role: "tool", name: functionToCallName, content: functionResponse,
                });
            }
        } else {
            console.log("<-------------------------Done--------------------------------->");
            messages.push({
                role: responseMessage.role, content: responseMessage.content,
            });

            //Storing messages to file to keep context between restarts
            const fs = require('fs');
            fs.writeFileSync('chatHistory.json', JSON.stringify(messages));
            return responseMessage.content;
        }
    }
}
async function main() {
    const fs = require('fs');
    let messages = [];
    //messages = [{ role: "system", content: systemMessage }];
    if (fs.existsSync('chatHistory.json')) {
        console.log("Reading chat history from file");
        const chatHistory = fs.readFileSync('chatHistory.json', 'utf-8');
        messages = JSON.parse(chatHistory);
    }
    else {
        //Read messages from file to keep context between restarts
        console.log("No chat history found, new conversation");
        messages = [{ role: "system", content: systemMessage }];
    }

    const prompt = promptSync();
    while (true) {
        const query = prompt("Enter your query: ");
        if (
          !!query && (
          query.toLowerCase() === 'bye' ||
          query.toLowerCase() === 'good bye' ||
          query.toLowerCase() === 'q' ||
          query.toLowerCase() === 'quit' ||
          query.toLowerCase() === 'exit'
        )) {
            console.log("Good bye!");
            break;
        }
        const response = await runQuery(query, messages);
        console.log(response)
    }
}

main().catch(console.error);
