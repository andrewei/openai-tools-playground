import axios from "axios";

export const wikipediaSearchApi = async (args) => {
  const query = args.message;
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    const searchResults = data.query.search;
    return searchResults.map((result) => {  return result.snippet; }).join("\n");
  } catch (error) {
    console.log(error);
    return "Could not search wikipedia";
  }
}

export const wikipediaSearchApiDescription = {
  type: "function", function: {
    name: "wikipedia_search_api",
    description: "Search wikipedia for a given query.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The query to search for, e.g. 'How many people live in Norway?.",
        },
      },
    },
  }
}
