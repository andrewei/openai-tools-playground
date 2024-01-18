//Create a function to get date
export const getDate = async (args) => {
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  return JSON.stringify(date);
}

export const dateDescription = {
  type: "function", function: {
    name: "get_date",
    description: "Get the current date, so that the assistant can say something like 'Today is 2021-10-10'.",
    parameters: {
      type: "object", properties: {
        message: {},
      },
    },
  }
}
