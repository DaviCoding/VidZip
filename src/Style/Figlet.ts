import figlet from "figlet";
import chalk from "chalk";

function RandomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default (text: any) => {
  console.log("");
  console.log("");
  console.log(
    chalk.hex(RandomColor())(
      figlet.textSync(`${text}`, {
        font: "3D-ASCII",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
  );
  console.log("");
};
