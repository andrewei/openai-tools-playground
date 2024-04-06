import axios from 'axios';
import { data } from 'cheerio/lib/api/attributes';
import fs from 'fs';

export const getDomainInfoFromHomeAssistant = async (data: {domain: string}) => {
  const {domain} = data;
  try {
    console.log("Geting services from home assistant")
    console.log("domain" + domain);
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
      
      const res = response.data.filter((element: any) => (element.domain === domain));
      if(response.data.length === 0) {
        return "No info about the domain";
      } 
      //return "not implemented yet"
      return JSON.stringify(res);
    
      //return JSON.stringify(response.data).substring(0, 5000);
    //console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};


export const getDomainInfoFromHomeAssistantDescription = {
  type: "function", function: {
    name: "get_domain_info_from_home_assistant",
    description: "Get information about services and so on from a single domain in home assistant",
    parameters: {
      type: "object", 
      properties: {
        domain: {
          type: "string",
          description: "The domain to get information about",
        },
      },
    }
  }
}