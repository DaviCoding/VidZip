import figlet from "./figlet";
import prompts from "prompts";
import ora from "ora";
figlet("VidZip");
const spinner = ora();
spinner.text = "Initializing";
spinner.start();
spinner.succeed("VidZip started successfully!");

export default (async () => {
  try {
    let format = await prompts([
      {
        type: "select",
        name: "option",
        message: "VidZip Tools?",
        choices: [
          { title: "Video", value: 1, description: "Format" },
          { title: "Audio", value: 2, description: "Format" },
        ],
      },
    ]);

    switch (format.option) {
      case 1:
        return await prompts([
          {
            type: "select",
            name: "option",
            message: "VidZip Tools?",
            choices: [
              { title: "Compress", value: 1, description: "Video" },
              { title: "Convert", value: 2, description: "Video" },
            ],
          },
        ]);

      default:
        console.log("Essa opção está inativa");
        break;
    }
  } catch (error) {
    console.error(error);
  }
})();
