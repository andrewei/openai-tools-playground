import fs from "fs";

export const writeOpenAIFunction = async (args: any) => {
    const code = args.code;
    const name = args.name;
    const codeName = args.codeName;
    const codeNameDescription = args.codeNameDescription;
    console.log("code");
    console.log(code);
    console.log("name");
    console.log(name);
    console.log("codeName");
    console.log(codeName);
    console.log("codeNameDescription");
    console.log(codeNameDescription);

    const fs = require('fs');
    fs.mkdirSync(`src/tools/${name}`, { recursive: true });
    fs.writeFileSync(`src/tools/${name}/${name}.ts`, code);

    // Read index.ts file
    const indexPath = 'src/index.ts';
    let indexContent = fs.readFileSync(indexPath, 'utf-8');

    // Insert import
    const importStatement = `import { ${codeName}, ${codeNameDescription} } from "./tools/${name}/${name}";\n`;
    indexContent = indexContent.replace('/*Insert import here*/', `${importStatement}/*Insert import here*/`);

    // Insert tool mapping
    const toolMapping = `    ${name}: ${codeName},\n`;
    indexContent = indexContent.replace('/*Insert tool here*/', `${toolMapping}    /*Insert tool here*/`);

    // Insert tool description
    const toolDescription = `    ${codeNameDescription},\n`;
    indexContent = indexContent.replace('/*Insert tool description here*/', `${toolDescription}    /*Insert tool description here*/`);

    // Write updated content back to index.ts
    fs.writeFileSync(indexPath, indexContent);





    return "Function written, you did it!";
}



export const writeOpenAIFunctionDescription = {
    type: "function", function: {
        name: "write_openai_function",
        description: "Enables you to write your own openAIFunctions! See showFunctionsExample for an example",
        parameters: {
            type: "object", properties: {
                codeName: {
                    type: "string",
                    description: "The name of the function, example generateAndRunJSCode, should be in camelCase, not in snake_case",
                },
                codeNameDescription: {
                    type: "string",
                    description: "The name of the descriptionFunction, example generateAndRunJSCodeDescription, should be in camelCase, not in snake_case",
                },
                name: {
                    type: "string",
                    description: "the underscored name of the function, example generate_and_run_js_code, should be in snake_case, not in camelCase",
                },
                code: {
                    type: "string",
                    description: `The code to run. Example:
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
        console.log("executing code");
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
}`
                },
            },
        },
    }
}