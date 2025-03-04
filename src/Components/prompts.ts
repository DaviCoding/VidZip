import figlet from "./figlet";
import prompts from "prompts";
import fs from "fs";
import path from "path";
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
        let multi = await prompts([
          {
            type: "select",
            name: "option",
            message: "Único arquivo ou muiltiplos?",
            choices: [
              { title: "Único", value: 1, description: "Quantidade" },
              { title: "Muitiplos", value: 2, description: "Quantidade" },
              { title: "Todos", value: 3, description: "Quantidade" },
            ],
          },
        ]);

        switch (multi.option) {
          case 1:
            switch (format.option) {
              case 1:
                fs.readdir("./video/input", async (err, files) => {
                  const videoExtensions = [
                    ".mp4",
                    ".avi",
                    ".mkv",
                    ".webm",
                    ".mov",
                  ];

                  var arr = [];

                  files = files.filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return videoExtensions.includes(ext);
                  });

                  for (let file of files) {
                    var item = { title: file, value: file };
                    arr.push(item);
                  }

                  return await prompts([
                    {
                      type: "multiselect",
                      name: "value",
                      instructions: false,
                      message: "Selecione os arquivos",
                      choices: arr,
                      max: 1,
                      min: 1,
                      hint: "- Space to select. Enter to submit",
                    },
                  ]);
                });
                break;
              default:
                break;
            }
            break;

          case 2:
            fs.readdir("./video/input", async (err, files) => {
              const videoExtensions = [".mp4", ".avi", ".mkv", ".webm", ".mov"];

              var arr = [];

              files = files.filter((file) => {
                const ext = path.extname(file).toLowerCase();
                return videoExtensions.includes(ext);
              });

              for (let file of files) {
                var item = { title: file, value: file };
                arr.push(item);
              }

              return await prompts([
                {
                  type: "multiselect",
                  name: "value",
                  instructions: false,
                  message: "Selecione os arquivos",
                  choices: arr,
                  max: 5,
                  min: 2,
                  hint: "- Space to select. Enter to submit",
                },
              ]);
            });
            break;
          case 3:
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

        break;

      default:
        break;
    }
  } catch (error) {
    console.error(error);
  }
})();
