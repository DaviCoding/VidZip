import prompts from "./Components/prompts";
import sketch from "./sketch";

prompts.then((response) => {
  switch (response.option) {
    case 1:
      sketch.Compress();
      break;
    default:
      console.log("Essa opção está inativa");
      break;
  }
});
