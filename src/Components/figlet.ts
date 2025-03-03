import figlet from "figlet";

export default (text: string) => {
  console.log(
    figlet.textSync(text, {
      font: "Big Money-ne",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
};
