import { writeFileSync, mkdirSync } from "fs";
import { replaceAll } from "../StringUtils";
import { templates } from "../Templates";
import { join } from "path";

export function ensureUseCase(useCasePath: string, testUseCasePath: string, useCaseName: string) {
  const useCaseTemplate = replaceAll(templates.useCaseTemplate, {
    "{{UseCaseName}}": useCaseName,
  });

  const testUseCaseTemplate = replaceAll(templates.testUseCaseTemplate, {
    "{{UseCaseName}}": useCaseName,
  });

  mkdirSync(join(useCasePath, ".."), { recursive: true });

  writeFileSync(useCasePath, useCaseTemplate);
  writeFileSync(testUseCasePath, testUseCaseTemplate);
}
