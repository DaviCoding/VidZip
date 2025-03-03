import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import chalk from "chalk";
import ora from "ora";
const spinner = ora();

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error("FFmpeg path not found");
}

export default async (input: string, output: string, length: number) => {
  ffmpeg(input)
    .output(output)
    .videoCodec("h264_nvenc") // Usa a GPU NVIDIA
    .size("1280x720")
    .outputOptions([
      "-preset p4", // Equilíbrio entre qualidade e velocidade (p1 mais rápido, p7 mais qualidade)
      "-crf 23", // Controla a qualidade (17 = alta qualidade, 23 = padrão, 28 = mais compactado)
      "-maxrate 5000k", // Limita a taxa de bits para evitar estouro
      "-bufsize 10000k", // Controle do buffer para estabilidade
    ])
    .on("start", () => spinner.start())
    .on("progress", (progress) => {
      spinner.text = `Compressão de ${length} arquivo(os) | FPS atual: ${progress.currentFps}`;
    })
    .on("end", () => spinner.succeed(`Compressão concluída`))
    .on("error", (err: Error) => {
      console.error(chalk.redBright.bold(err.message));
      console.log(
        chalk.greenBright.bold(
          "Coloque um arquivo para ser compactado na pasta 'video/input'"
        )
      );
    })
    .run();
};
