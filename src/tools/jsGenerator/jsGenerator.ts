import fs from "fs";
import {exec} from "child_process";

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
export const generateAndRunJsCodeInDocker = async (args) => {
  console.log(args);
  //Store the code in a file
  const fs = require('fs');
  const code = args.code;
  fs.writeFileSync('code.js', code);
  //Run the code
  const { exec } = require("child_process");

  return new Promise((resolve, reject) => {
    try {
      exec("docker run -v $(pwd):/usr/src/app -w /usr/src/app node:16 node code.js", (error, stdout, stderr) => {
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
  }


  export const runJSCodeInDockerDescription = {
    type: "function", function: {
      name: "run_js_code_in_docker",
      description: "Takes in a piece of javascript code and runs it in a docker container. The output should be the docker container output.",
      parameters: {
        type: "object", properties: {
          code: {
            type: "string",
            description: "This is the code that will be run. The output should be the docker container output.",
          },
        },
      },
    }
  }
