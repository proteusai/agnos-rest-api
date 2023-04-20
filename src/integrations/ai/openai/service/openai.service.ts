import { AiService } from "@ai/services/base";

export class OpenAiService extends AiService {
  prompt: (input: string) => Promise<string> = async (input: string) => {
    return `Hello World ${input}`;
  };
}
