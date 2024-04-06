import axios from "axios";

export const googleSearchApi = async (args) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

  try {
    const {message} = args;
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${message}`;
    const response = await axios.get(url);
    const data = response.data;
    //Return a list of the first three snippets
    const snippets = data.items.map(item => item.snippet).slice(0, 3);
    console.log(snippets)
    //curl the first result and return the text from the page
    const firstResult = data.items[0];
    const firstUrl = firstResult.link;
    const firstResponse = await axios.get(firstUrl);
    const firstData = firstResponse.data;
    //use Cherio to get all text from the page and avoid unnecessary text
    const cheerio = require('cheerio');
    const $ = cheerio.load(firstData);
    // Remove script and style elements
    $('script, style').remove();

    // Get the text content of p and header tags, excluding comments
    let text = $('p, h1, h2, h3, h4, h5, h6').contents().filter(function() {
      return this.type !== 'comment';
    }).text();

    //console.log(text);

    // Remove all spaces and line breaks
    const res = text.replace(/\s+/g, ' ');

    //console.log(data.items[0]);
    //console.log(snippets)
    return JSON.stringify(snippets) + " " + res;

  } catch (error) {
    console.log(error);
    return JSON.stringify('Error fetching google search data. Service may be down.');
  }
}

export const googleSearchApiDescription = {
  type: "function", function: {
    name: "google_search_api",
    description: "Search google for a given query.",
    parameters: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The query to search for, e.g. 'Who won the football world cup in 2023?.",
        },
      },
    },
  }
}
