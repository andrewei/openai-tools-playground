import axios from "axios";

export const getWeekNumber = async (args) => {
  const today = new Date();
  const url = `https://ukenummer.no/json`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    const weekNumber = data.weekNo;
    if (response.status !== 200) {
      return JSON.stringify("Could not get week number");
    }
    return JSON.stringify(weekNumber);
  }
  catch (error) {
    console.log(error);
    return JSON.stringify('Error fetching week number. Service may be down.');
  }
}

export const weekNumberDescription = {
  type: "function", function: {
    name: "get_week_number",
    description: "Get week number based on current date. The function knows the current date, so no parameters are needed.",
    parameters: {
      type: "object", properties: {
        message: {},
      },
    },
  }
}
