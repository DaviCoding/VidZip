import prompts from "prompts";
export default prompts([
  {
    type: "select",
    name: "option",
    message: "O que você deseja fazer?",
    choices: [
      { title: "Compressor", value: 1 },
      { title: "Conversor", value: 2 },
    ],
  },
]);
