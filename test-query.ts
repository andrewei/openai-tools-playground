import dotenv from "dotenv";

dotenv.config();

import { OpenAI } from "openai";
import type { ChatCompletionTool } from "openai/resources/chat/completions";
import {
	generateDalleImage,
	generateDalleImageDescription,
} from "./src/tools/dalle/dalleImageGenerator";
import { dateDescription, getDate } from "./src/tools/date/date";
import {
	googleSearchApi,
	googleSearchApiDescription,
} from "./src/tools/google/googleSearchApi";
import {
	getDomainInfoFromHomeAssistant,
	getDomainInfoFromHomeAssistantDescription,
} from "./src/tools/homeAssistant/homeAssistantGetDomainInfo";
import {
	getDomainsFromHomeAssistant,
	getDomainsFromHomeAssistantDescription,
} from "./src/tools/homeAssistant/homeAssistantGetDomains";
import {
	sendLightCommandsToHomeAssistant,
	sendLightCommandsToHomeAssistantDescription,
} from "./src/tools/homeAssistant/homeAssistantLights";
import { killSelf, killSelfDescription } from "./src/tools/killSelf/killSelf";
import { readNote, readNoteDescription } from "./src/tools/notes/readNote";
import { writeNote, writeNoteDescription } from "./src/tools/notes/writeNote";
import {
	getWeekNumber,
	weekNumberDescription,
} from "./src/tools/weekNumber/weekNumber";
import {
	wikipediaSearchApi,
	wikipediaSearchApiDescription,
} from "./src/tools/wikipedia/wikipediaSearchApi";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const toolsMapping: Record<string, (args: unknown) => Promise<unknown>> = {
	get_date: getDate,
	get_week_number: getWeekNumber,
	google_search_api: googleSearchApi,
	wikipedia_search_api: wikipediaSearchApi,
	send_light_commands_to_home_assistant: sendLightCommandsToHomeAssistant,
	get_domains_from_home_assistant: getDomainsFromHomeAssistant,
	get_domain_info_from_home_assistant: getDomainInfoFromHomeAssistant,
	kill_self: killSelf,
	write_note: writeNote,
	read_note: readNote,
	generate_dalle_image: generateDalleImage,
};

const tools = [
	dateDescription,
	weekNumberDescription,
	googleSearchApiDescription,
	wikipediaSearchApiDescription,
	sendLightCommandsToHomeAssistantDescription,
	getDomainsFromHomeAssistantDescription,
	getDomainInfoFromHomeAssistantDescription,
	killSelfDescription,
	writeNoteDescription,
	readNoteDescription,
	generateDalleImageDescription,
];

const systemMessage =
	"You are an informative AI that helps user with different questions. You have been provided with different tools to help answer these questions.";

async function runQuery(
	query: string,
	messages: { role: string; content: string | null }[],
) {
	console.log("\n[AI] Thinking about your query...\n");
	messages.push({ role: "user", content: query });
	let toolNumber = 1;
	while (true) {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo-1106",
			messages: messages as OpenAI.ChatCompletionMessageParam[],
			tools: tools as ChatCompletionTool[],
			tool_choice: "auto",
		});
		const responseMessage = response.choices[0].message;
		const toolCalls = responseMessage.tool_calls;
		if (toolCalls && toolCalls.length > 0) {
			messages.push(
				responseMessage as { role: string; content: string | null },
			);
			console.log(`[AI] Tool calls detected: ${toolCalls.length}`);
			for (const toolCall of toolCalls) {
				let functionToCallName: string, functionArgs: unknown;
				if (toolCall.type === "function" && toolCall.function) {
					functionToCallName = toolCall.function.name;
					functionArgs = JSON.parse(toolCall.function.arguments);
					console.log(
						`\n[AI] Calling function tool #${toolNumber}: ${functionToCallName}`,
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
				let functionResponse: unknown;
				try {
					functionResponse = await functionToCall(functionArgs);
					console.log(`[AI] Tool response:`, functionResponse);
				} catch (err) {
					functionResponse = `Error: ${(err as Error)?.message || err}`;
					console.error(`[AI] Tool error:`, err);
				}
				messages.push({
					tool_call_id: toolCall.id,
					role: "tool",
					name: functionToCallName,
					content:
						typeof functionResponse === "string"
							? functionResponse
							: JSON.stringify(functionResponse),
				} as { role: string; content: string | null });
				toolNumber++;
			}
		} else {
			messages.push(
				responseMessage as { role: string; content: string | null },
			);
			return responseMessage.content;
		}
	}
}

async function main() {
	const query = process.argv[2];
	if (!query) {
		console.log('Usage: npx ts-node test-query.ts "Your question here"');
		process.exit(1);
	}

	const messages: { role: string; content: string | null }[] = [
		{ role: "system", content: systemMessage },
	];

	console.log(`Query: ${query}`);
	const response = await runQuery(query, messages);
	console.log("\n[AI Response]:", response);
}

main().catch(console.error);
