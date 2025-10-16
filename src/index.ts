import fs from "node:fs";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import promptSync from "prompt-sync";
import { dateDescription, getDate } from "./tools/date/date";
import {
	googleSearchApi,
	googleSearchApiDescription,
} from "./tools/google/googleSearchApi";
import {
	getDomainInfoFromHomeAssistant,
	getDomainInfoFromHomeAssistantDescription,
} from "./tools/homeAssistant/homeAssistantGetDomainInfo";
import {
	getDomainsFromHomeAssistant,
	getDomainsFromHomeAssistantDescription,
} from "./tools/homeAssistant/homeAssistantGetDomains";
import {
	sendLightCommandsToHomeAssistant,
	sendLightCommandsToHomeAssistantDescription,
} from "./tools/homeAssistant/homeAssistantLights";
import {
	generateAndRunJSCode,
	generateAndRunJsCode,
	generateAndRunJsCodeInDocker,
	runJSCodeInDockerDescription,
} from "./tools/jsGenerator/jsGenerator";
import { killSelf, killSelfDescription } from "./tools/killSelf/killSelf";
import { readNote, readNoteDescription } from "./tools/notes/readNote";
import { writeNote, writeNoteDescription } from "./tools/notes/writeNote";
import {
	generateAndRunPythonCode,
	generateAndRunPythonCodeDescription,
} from "./tools/pythonGenerator/pythonGenerator";
import { getCarInfo, getCarInfoDescription } from "./tools/tesla/getCarInfo";
import {
	getRefreshTokenDescription,
	getTeslaToken,
} from "./tools/tesla/getTeslaToken";
import { wakeUpCar, wakeUpCarDescription } from "./tools/tesla/wakeUpCar";
import { getWeekNumber } from "./tools/weekNumber/weekNumber";
import {
	wikipediaSearchApi,
	wikipediaSearchApiDescription,
} from "./tools/wikipedia/wikipediaSearchApi";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const toolsMapping = {
	get_week_number: getWeekNumber,
	get_date: getDate,
	google_search_api: googleSearchApi,
	generate_and_run_js_code: generateAndRunJsCode,
	get_car_info: getCarInfo,
	wake_up_car: wakeUpCar,
	generate_and_run_python_code: generateAndRunPythonCode,
	get_refresh_token_from_tesla: getTeslaToken,
	run_js_code_in_docker: generateAndRunJsCodeInDocker,
	wikipedia_search_api: wikipediaSearchApi,
	send_light_commands_to_home_assistant: sendLightCommandsToHomeAssistant,
	get_domains_from_home_assistant: getDomainsFromHomeAssistant,
	get_domain_info_from_home_assistant: getDomainInfoFromHomeAssistant,
	kill_self: killSelf,
	write_note: writeNote,
	read_note: readNote,
};

const tools = [
	dateDescription,
	googleSearchApiDescription,
	generateAndRunJSCode,
	generateAndRunPythonCodeDescription,
	wakeUpCarDescription,
	getCarInfoDescription,
	getRefreshTokenDescription,
	runJSCodeInDockerDescription,
	wikipediaSearchApiDescription,
	sendLightCommandsToHomeAssistantDescription,
	getDomainsFromHomeAssistantDescription,
	getDomainInfoFromHomeAssistantDescription,
	killSelfDescription,
	writeNoteDescription,
	readNoteDescription,
];

const systemMessage =
	"You are an informative AI that helps user with different questions. You have been provided with different tools to help answer these questions.";

async function runQuery(query, messages) {
	console.log("\n[AI] Thinking about your query...\n");
	messages.push({ role: "user", content: query });
	let toolNumber = 1;
	while (true) {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo-1106",
			messages: messages,
			tools: tools as any,
			tool_choice: "auto",
		});
		const responseMessage = response.choices[0].message;
		const toolCalls = responseMessage.tool_calls;
		if (toolCalls && toolCalls.length > 0) {
			messages.push(responseMessage);
			console.log(`[AI] Tool calls detected: ${toolCalls.length}`);
			for (const toolCall of toolCalls) {
				let functionToCallName, functionArgs;
				if (toolCall.type === "function" && toolCall.function) {
					functionToCallName = toolCall.function.name;
					functionArgs = JSON.parse(toolCall.function.arguments);
					console.log(
						`\n[AI] Calling function tool #${toolNumber}: ${functionToCallName}`,
					);
				} else if (toolCall.type === "custom" && toolCall.custom) {
					functionToCallName = toolCall.custom.name;
					functionArgs = toolCall.custom.input; // adjust if your custom tools expect input differently
					console.log(
						`\n[AI] Calling custom tool #${toolNumber}: ${functionToCallName}`,
					);
				} else {
					console.error(`[AI] Unknown tool call type:`, toolCall);
					continue;
				}
				const functionToCall = toolsMapping[functionToCallName];
				if (!functionToCall) {
					console.error(
						`[AI] Tool '${functionToCallName}' not found in toolsMapping.`,
					);
					continue;
				}
				console.log(`[AI] Arguments:`, functionArgs);
				let functionResponse;
				try {
					functionResponse = await functionToCall(functionArgs);
					console.log(`[AI] Tool response:`, functionResponse);
				} catch (err) {
					functionResponse = `Error: ${err?.message || err}`;
					console.error(`[AI] Tool error:`, err);
				}
				messages.push({
					tool_call_id: toolCall.id,
					role: "tool",
					name: functionToCallName,
					content: functionResponse,
				});
				toolNumber++;
			}
		} else {
			console.log("[AI] No tool calls. Returning response.\n");
			messages.push({
				role: responseMessage.role,
				content: responseMessage.content,
			});
			fs.writeFileSync("chatHistory.json", JSON.stringify(messages));
			return responseMessage.content;
		}
	}
}
async function main() {
	const fs = require("node:fs");
	let messages = [];
	//messages = [{ role: "system", content: systemMessage }];
	if (fs.existsSync("chatHistory.json")) {
		console.log("Reading chat history from file");
		const chatHistory = fs.readFileSync("chatHistory.json", "utf-8");
		messages = JSON.parse(chatHistory);
	} else {
		//Read messages from file to keep context between restarts
		console.log("No chat history found, new conversation");
		messages = [{ role: "system", content: systemMessage }];
	}

	const prompt = promptSync();
	while (true) {
		const query = prompt("Enter your query: ");
		if (
			!!query &&
			(query.toLowerCase() === "bye" ||
				query.toLowerCase() === "good bye" ||
				query.toLowerCase() === "q" ||
				query.toLowerCase() === "quit" ||
				query.toLowerCase() === "exit")
		) {
			console.log("Good bye!");
			break;
		}
		const response = await runQuery(query, messages);
		console.log(response);
	}
}

main().catch(console.error);
