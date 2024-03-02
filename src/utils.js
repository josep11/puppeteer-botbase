import path from "path";
import { fileURLToPath } from "url";

/**
 * @param {string} importMetaUrl
 * @returns {string} the dirname from the path
 */
export function dirname(importMetaUrl) {
  // noinspection UnnecessaryLocalVariableJS
  const __dirname = path.dirname(fileURLToPath(importMetaUrl));
  return __dirname;
}
