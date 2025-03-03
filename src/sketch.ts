import compress from "./Options/compress";
import fs from "fs";
import path from "path";

export default class Sketch {
  static listVideos: string[] = [];

  static listVideoFiles(directory: string): void {
    fs.readdir(directory, (err, files) => {
      if (err) return console.error(err);

      const videoExtensions = [".mp4", ".avi", ".mkv", ".webm", ".mov"];

      Sketch.listVideos = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext);
      });
    });
  }

  static Compress() {
    const listvideo = Sketch.listVideos;

    listvideo.forEach((video) => {
      compress(
        `./video/input/${video}`,
        `./video/output/${video}`,
        listvideo.length
      );
    });
  }
}

Sketch.listVideoFiles("./video/input");
