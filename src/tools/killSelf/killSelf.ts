//Create a function to get date
export const killSelf = async (args) => {
  process.exit(66);
}

export const killSelfDescription = {
  type: "function", function: {
    name: "kill_self",
    description: "exit the process, to enable restarting/killing yourself with new code. Can be /wrist, like in slash wrist",
    parameters: {
      type: "object", properties: {
        code: {type: "number", description: "The exit code to return"
        },
      },
    },
    },
  }
