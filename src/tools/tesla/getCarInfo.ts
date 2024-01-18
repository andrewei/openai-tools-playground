import fs from "fs";
import axios from "axios";

export const getCarInfo = async () => {
  const vin = process.env.TESLA_VIN;
  const token = fs.readFileSync('src/.token', 'utf8').trim();
  const url = `https://owner-api.teslamotors.com/api/1/vehicles/${vin}/vehicle_data`;
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response.data;

    if(response.status !== 200) {
      return JSON.stringify("Could not get car info " + data.error + " : " + data.error.desciption);
    }

    return JSON.stringify(data);
  } catch (error) {
    console.log(error);
    return JSON.stringify('Error fetching car info. Service may be down.');
  }
}

export const getCarInfoDescription = {
  type: "function", function: {
    name: "get_car_info",
    description: "Get information about a Tesla car. If the user talks about a Tesla or a car, it is this one. It returns information like Battery charge, Car name, etc. A JSON format with information will be the result of the function.",
  }
}
