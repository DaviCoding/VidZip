import promptHandling from "../Controller/PromptController";
import TratamentFile from "../Model/tratament";

new TratamentFile([
  {
    name: `${promptHandling.data.selectedFiles}`,
    format: `${promptHandling.data.formatResponse.format}`,
    compress: promptHandling.data.CompressFiles.value,
  },
]);

export default {
  statusCode: promptHandling.statusCode,
};
