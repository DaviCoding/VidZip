import prompts from "prompts";
import FigletLog from "./Style/Figlet";
import ora from "ora";
import fs from "fs";
import path from "path";

// Função para exibir o log inicial
const showInitialLog = () => {
  FigletLog("VidZip");
  ora(" Successful application initialization").succeed();
  console.log();
};

// Função para listar arquivos em um diretório
const listFilesInDirectory = (directory: string): string[] => {
  if (!fs.existsSync(directory)) {
    console.log(console.log("A pasta de entrada não existe! Criando..."));
    fs.mkdirSync(directory, { recursive: true });
  }
  try {
    const files = fs.readdirSync(directory);
    return files.filter((file) =>
      fs.statSync(path.join(directory, file)).isFile()
    );
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
};

// Função principal
const main = async () => {
  showInitialLog();

  // Pergunta 1: Tipo de arquivo (Vídeo ou Áudio)
  const fileModelResponse = await prompts({
    type: "select",
    name: "fileModel",
    message: "Which file model do you want to manipulate?",
    choices: [
      { title: "Video", value: "video" },
      { title: "Audio", value: "audio" },
    ],
    initial: 0,
  });

  // Pergunta 2: Quantidade de arquivos (Único, Múltiplos ou Todos)
  const amountFilesResponse = await prompts({
    type: "select",
    name: "amountFiles",
    message: "How many files do you want to handle?",
    choices: [
      { title: "Single", value: "single" },
      { title: "Multiples", value: "multiples" },
      { title: "All", value: "all" },
    ],
    initial: 0,
  });

  // Pergunta 3: Formato do arquivo (depende do tipo escolhido)
  const formatResponse = await prompts({
    type: "select",
    name: "format",
    message: `What ${fileModelResponse.fileModel} format do you want to use? (This can convert)`,
    choices:
      fileModelResponse.fileModel === "video"
        ? [
            { title: "MP4", value: "mp4" },
            { title: "AVI", value: "avi" },
            { title: "MKV", value: "mkv" },
          ]
        : [
            { title: "MP3", value: "mp3" },
            { title: "WAV", value: "wav" },
            { title: "FLAC", value: "flac" },
          ],
    initial: 0,
  });

  // Diretório de entrada
  const inputDirectory = "./videos/input";

  // Listar arquivos no diretório de entrada
  const filesInDirectory = listFilesInDirectory(inputDirectory);

  let selectedFiles: string[] = [];

  // Pergunta 4: Seleção de arquivos (depende da quantidade escolhida)
  if (amountFilesResponse.amountFiles === "single") {
    const singleFileResponse = await prompts({
      type: "select",
      name: "fileName",
      message: "Select the file you want to handle:",
      choices: filesInDirectory.map((file) => ({
        title: file,
        value: file,
      })),
      initial: 0,
    });
    selectedFiles = [singleFileResponse.fileName];
    console.log(`You selected file: ${singleFileResponse.fileName}`);
  } else if (amountFilesResponse.amountFiles === "multiples") {
    const multipleFilesResponse = await prompts({
      type: "multiselect",
      name: "fileNames",
      message: "Select the files you want to handle:",
      choices: filesInDirectory.map((file) => ({
        title: file,
        value: file,
      })),
      instructions: false,
      hint: "- Space to select. Return to submit",
    });
    selectedFiles = multipleFilesResponse.fileNames;
    console.log(
      `You selected files: ${multipleFilesResponse.fileNames.join(", ")}`
    );
  } else if (amountFilesResponse.amountFiles === "all") {
    selectedFiles = filesInDirectory;
    console.log("You selected all files:", filesInDirectory.join(", "));
  }

  // Pergunta 5: Opção de compressão
  const CompressFiles = await prompts({
    type: "toggle",
    name: "value",
    message: `Do you want to compress the files?`,
    initial: true,
    active: "Yes",
    inactive: "No",
  });

  return {
    fileModelResponse,
    amountFilesResponse,
    formatResponse,
    selectedFiles,
    CompressFiles,
  };
};

// Executar a função principal
export default main();
