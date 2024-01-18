export const generateAndRunPythonCode = async (args) => {
  console.log(args);
  //Store the code in a file
  const fs = require('fs');
  const code = args.code;
  fs.writeFileSync('pythonCode.py', code);
  //Run the code
  const { exec } = require("child_process");

  return new Promise((resolve, reject) => {
    try {
      exec("python3 pythonCode.py", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          reject(`error: ${error.message}`);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          reject(`stderr: ${stderr}`);
        }
        console.log(`stdout: ${stdout}`);
        resolve(`stdout: ${stdout}`);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}


export const generateAndRunPythonCodeDescription = {
  type: "function", function: {
    name: "generate_and_run_python_code",
    description: "Generate and run some python code that can solve the problem at hand. End the program with a print() with the result",
    parameters: {
      type: "object", properties: {
        code: {
          type: "string",
          description: "This is the code that will be run. it should end with a print() with the result.",
        },
      },
    },
  },
}
