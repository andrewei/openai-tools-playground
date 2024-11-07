//Create a function to get date
export const showFunctionsExample = async (args) => {
  return `
      This shows how the generateAndRunJSCode function is written.
      Write your own function and description like this by calling writeOpenAIFunctions
      using the following formula:
      Parameters 
      codeName: generateAndRunJsCode,
      codeNameDescription: generateAndRunJsCodeDescription,
      name: generate_and_run_js_code,
      code: 
      
      export const generateAndRunJsCode = async (args) => {
  console.log(args);
  //Store the code in a file
  const fs = require('fs');
  const code = args.code;
  fs.writeFileSync('code.js', code);
  //Run the code
  const { exec } = require("child_process");

  return new Promise((resolve, reject) => {
    try {
      exec("node code.js", (error, stdout, stderr) => {
        if (error) {
          console.log(\`error: \${error.message}\`);
          reject(\`error: \${error.message}\`);
        }
        if (stderr) {
          console.log(\`stderr: \${stderr}\`);
          reject(\`stderr: \${stderr}\`);
        }
        console.log(\`stdout: \${stdout}\`);
        resolve(\`stdout: \${stdout}\`);
      });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}
    export const generateAndRunJSCodeDescription = {
    type: "function", function: {
      name: "generate_and_run_js_code",
      description: "Generate and run some javascript code that can solve the problem at hand. End the program with a console.log() with the result",
      parameters: {
        type: "object", properties: {
          code: {
            type: "string",
            description: "This is the code that will be run. it should end with a console.log() with the result.",
          },
        },
      },
    },
  }`;
}

export const showFunctionsExampleDescription = {
  type: "function", function: {
    name: "show_functions_example",
    description: "shows how to to use writeOpenAIFunction by getting an example, you can create your own code by using this example and modify it to your needs. Read this before calling writeOpenAIFunction",
  },
}
