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
    .videoCodec("libx264")
    .size("1280x720")
    .on("start", () => {
      spinner.start();
    })
    .on("progress", (progress) => {
      spinner.text = `Compressão de ${length} arquivo(os)`;
    })
    .on("end", () => {
      spinner.succeed("Compressão concluída!");
    })
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
