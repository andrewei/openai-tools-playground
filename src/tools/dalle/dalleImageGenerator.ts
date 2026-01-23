import fs from "node:fs";
import path from "node:path";
import axios from "axios";
import { OpenAI } from "openai";

const IMAGES_DIR = path.join(process.cwd(), "generated_images");

export const generateDalleImage = async (args: {
	prompt: string;
	size?: "1024x1024" | "1792x1024" | "1024x1792";
}) => {
	const { prompt, size = "1024x1024" } = args;
	const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

	try {
		if (!fs.existsSync(IMAGES_DIR)) {
			fs.mkdirSync(IMAGES_DIR, { recursive: true });
		}

		console.log(`[DALL-E] Generating image with prompt: "${prompt}"`);

		const response = await openai.images.generate({
			model: "dall-e-3",
			prompt: prompt,
			n: 1,
			size: size,
		});

		const imageUrl = response.data[0].url;
		const revisedPrompt = response.data[0].revised_prompt;

		console.log(`[DALL-E] Image generated, downloading...`);

		const imageResponse = await axios.get(imageUrl, {
			responseType: "arraybuffer",
		});

		const timestamp = Date.now();
		const filename = `dalle_${timestamp}.png`;
		const filepath = path.join(IMAGES_DIR, filename);

		fs.writeFileSync(filepath, imageResponse.data);

		console.log(`[DALL-E] Image saved to: ${filepath}`);

		return JSON.stringify({
			success: true,
			filepath: filepath,
			revised_prompt: revisedPrompt,
		});
	} catch (error) {
		console.error("[DALL-E] Error:", error);
		return JSON.stringify({
			success: false,
			error: error.message || "Failed to generate image",
		});
	}
};

export const generateDalleImageDescription = {
	type: "function",
	function: {
		name: "generate_dalle_image",
		description:
			"Generate an image using DALL-E 3 based on a text prompt. The image will be saved locally.",
		parameters: {
			type: "object",
			properties: {
				prompt: {
					type: "string",
					description:
						"A detailed description of the image you want to generate, e.g. 'A cute cat wearing a top hat, digital art style'",
				},
				size: {
					type: "string",
					enum: ["1024x1024", "1792x1024", "1024x1792"],
					description:
						"The size of the generated image. 1024x1024 is square, 1792x1024 is landscape, 1024x1792 is portrait. Defaults to 1024x1024.",
				},
			},
			required: ["prompt"],
		},
	},
};
