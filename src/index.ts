import prompts from "./Components/prompts";
import sketch from "./sketch";

(async () => {
  const response = await prompts;
  switch (response?.option) {
    case 1:
      sketch.Compress();
      break;
    default:
      console.log("Essa opção está inativa");
      break;
  }
})();
