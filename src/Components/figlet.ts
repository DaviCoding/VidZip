import figlet from "figlet";
import chalk from "chalk";

export default (text: string) => {
  console.log(
    chalk.cyan(
      figlet.textSync(text, {
        font: "Big Money-ne",
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 80,
        whitespaceBreak: true,
      })
    )
  );
};
