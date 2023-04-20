export abstract class AiService {
  abstract prompt: (input: string) => Promise<string>;
}
