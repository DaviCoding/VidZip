import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";

const spinner = ora();

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error("FFmpeg path not found");
}

interface FileObject {
  name: string;
  format: string;
  compress: boolean;
}

export default class TratamentFile {
  inputFolder: string = "./videos/input";
  outputFolder: string = "./videos/output";
  files: FileObject[];
  validFiles: { input: string; output: string }[];

  constructor(files: FileObject[]) {
    this.files = files;

    // Garantir que as pastas de entrada e saída existam
    this.checkFolders();

    // Filtrando arquivos válidos
    this.validFiles = files
      .map((file) => {
        const inputPath = path.join(this.inputFolder, file.name);

        if (!fs.existsSync(inputPath)) {
          console.error(
            chalk.redBright.bold(`Arquivo não encontrado: ${file.name}`)
          );
          return null; // Ignora arquivos inexistentes
        }

        return {
          input: inputPath,
          output: path.join(
            this.outputFolder,
            `${path.parse(file.name).name}.${file.format}`
          ),
        };
      })
      .filter(Boolean) as { input: string; output: string }[];

    if (this.validFiles.length === 0) {
      spinner.fail("Nenhum arquivo válido encontrado.");
      return;
    }
    if (this.files[0].compress) {
      spinner.start();
      spinner.text = `Processando ${this.validFiles.length} arquivo(s)...`;
      this.compress();
    }
  }

  // Verificar se as pastas de entrada e saída existem
  checkFolders() {
    if (!fs.existsSync(this.inputFolder)) {
      fs.mkdirSync(this.inputFolder, { recursive: true }); // A opção { recursive: true } cria a pasta e as subpastas, se necessário
      console.log(`Pasta ${this.inputFolder} criada com sucesso!`);
    }

    if (!fs.existsSync(this.outputFolder)) {
      console.log(
        chalk.yellowBright(`A pasta de saída não existe. Criando...`)
      );
      fs.mkdirSync(this.outputFolder, { recursive: true });
    }
  }

  async compress(): Promise<void> {
    try {
      await Promise.all(
        this.validFiles.map((file, index) => {
          return new Promise((resolve, reject) => {
            ffmpeg(file.input)
              .inputOptions(["-hwaccel cuda", "-c:v h264_cuvid"]) // Usa GPU na decodificação
              .output(file.output)
              .videoCodec("h264_nvenc") // Usa NVENC para codificação
              .outputOptions([
                "-preset slow", // Usa um preset mais lento para melhor compressão
                "-crf 23", // CRF 23 é um bom equilíbrio entre qualidade e compressão
                "-maxrate 5000k", // Taxa de bits máxima de 5000 kbps
                "-bufsize 10000k", // Tamanho do buffer de 10000 kbps
                "-movflags +faststart", // Move o metadata para o início do arquivo (útil para streaming)
                "-pix_fmt yuv420p", // Formato de pixel compatível com a maioria dos dispositivos
              ])
              .on("progress", (progress) => {
                spinner.text = `(${index + 1}/${
                  this.validFiles.length
                }) FPS atual: ${progress.currentFps}`;
              })
              .on("end", () => resolve(file.output))
              .on("error", (err: Error) => {
                console.error(
                  chalk.redBright.bold(
                    `Erro ao processar ${file.input}: ${err.message}`
                  )
                );
                reject(err);
              })
              .run();
          });
        })
      );

      spinner.succeed("Todos os arquivos foram processados!");
    } catch {
      spinner.fail("Erro ao processar alguns arquivos!");
    }
  }
}
