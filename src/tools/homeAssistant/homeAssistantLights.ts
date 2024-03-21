import axios from 'axios';
import fs from 'fs';

export const sendLightCommandsToHomeAssistant = async (data: {light: string, color: string, on: number}) => {
  try {
    console.log("Sending light commands to home assistant")
    const token = fs.readFileSync('src/ha.token', 'utf-8').trim();
    //console.log("Token: ", token);
    let area = [] as any;
    if(!data.light || data.light === "all") {
      area = ["soverom", "kjokken", "stue"];
    } else {
      area = [data.light];
    }
    const response = await axios.post('http://192.168.1.42:8123/api/services/light/turn_on', {
      area_id: area,
      color_name: data.color,
      brightness_pct: data.on
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    //console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  return "ok"
};



export const sendLightCommandsToHomeAssistantDescription = {
  type: "function", function: {
    name: "send_light_commands_to_home_assistant",
    description: "Send light commands to home assistant",
    //Take in parameters to turn on/off lights, and change the color of the lights
    parameters: {
      type: "object", properties: {
        light: {"type": "string", "description": "The area to controll, soverom, kjokken, stue, of all if none is defined"},
        color: {"type": "string", "description": "The color to set the light to"},
        on: {"type": "number", "description": "dim levels, from 0 to 100, 0 is off, 100 is full brightness"}
        },
    },
  }
}
