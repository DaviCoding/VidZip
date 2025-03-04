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
    .inputOptions(["-hwaccel cuda", "-c:v h264_cuvid"]) // Decodifica o vídeo usando a GPU
    .output(output)
    .videoCodec("h264_nvenc") // Usa NVENC para codificação acelerada pela GPU
    .outputOptions([
      "-gpu 0", // Se tiver mais de uma GPU, escolha qual usar
      "-preset p4", // Equilíbrio entre velocidade e qualidade (p1 = mais rápido, p7 = mais qualidade)
      "-crf 23", // Controla a qualidade sem necessidade de um bitrate fixo (ajuste entre 18-28)
      "-rc vbr", // Habilita taxa de bits variável para compressão eficiente
      "-maxrate 6000k", // Limita o pico da taxa de bits (ajuste conforme necessário)
      "-bufsize 12000k", // Controla o buffer para evitar oscilações bruscas de qualidade
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
