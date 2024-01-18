import fs from "fs";
import axios from "axios";
import OpenAI from "openai";

export const wakeUpCar = async () => {
  const vin = process.env.TESLA_VIN;
  const token = fs.readFileSync('src/.token', 'utf8').trim();
  const url = `https://owner-api.teslamotors.com/api/1/vehicles/${vin}/wake_up`;

  try {
  const response = await axios.post(url, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = response.data;

  if(response.status !== 200) {
    return JSON.stringify("Could not wake up car: " + data.error + " : " + data.error.desciption);
  }

  return JSON.stringify(data.response);
  } catch (error) {
    console.log(error);
    return JSON.stringify('Error waking up car. Service may be down.');
  }
}

export const wakeUpCarDescription = {
  type: "function", function: {
    name: "wake_up_car",
    description: "Wake up the car. This is needed if the get_car_info returns an error saying the car is offline or asleep.",
  }
}
