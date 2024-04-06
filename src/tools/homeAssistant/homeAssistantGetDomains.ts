import axios from 'axios';
import { data } from 'cheerio/lib/api/attributes';
import fs from 'fs';

export const getDomainsFromHomeAssistant = async () => {
  try {
    console.log("Geting services from home assistant")
    const token = fs.readFileSync('src/ha.token', 'utf-8').trim();
    //console.log("Token: ", token);
    let area = [] as any;
      console.log("Sending get request for home_assistant")
      const response = await axios.get("http://192.168.1.42:8123/api/services",
        {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      //console.log("Response from home_assistant")
      //console.log(response.data)
      
      const domains = [];
      response.data.forEach(element => {
        domains.push(element.domain);
      });
      return JSON.stringify(domains);
      //return JSON.stringify(response.data).substring(0, 5000);
    //console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};


export const getDomainsFromHomeAssistantDescription = {
  type: "function", function: {
    name: "get_domains_from_home_assistant",
    description: "Get domains from home assistant",
  }
}
