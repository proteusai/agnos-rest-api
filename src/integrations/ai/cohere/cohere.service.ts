import { AiService } from "@ai/services/base";

export class CohereService extends AiService {
  prompt: (input: string) => Promise<string> = async (input: string) => {
    return `Hello World ${input} from cohere`;
  };
}
