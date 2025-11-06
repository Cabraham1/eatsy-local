/**
 * Converts a string to a capitalized label format.
 *
 * @param {string} [input=''] - The input string to be converted.
 * @returns {string} The converted string in capitalized label format.
 */
export const convert2label = (input = ""): string => {
  if (!input) {
    return "";
  }

  // Define exceptions for words that should not be manipulated
  const exceptions = new Set(["MFA", "C2C", "IP", "EULA", "IB"]);

  // 1. Replace separators with spaces
  let s = input.replace(/[_-]/g, " ");

  // 2. Add spaces for camelCase and PascalCase, including handling acronyms followed by words (e.g., IPAddress -> IP Address)
  s = s
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Lowercase followed by Uppercase
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2"); // Uppercase followed by Uppercase+Lowercase

  // 3. Split into words, filter out empty strings, and capitalize
  const words = s.split(" ").filter(Boolean); // This ==> filter(Boolean) removes empty strings

  const capitalizedWords = words.map((word) => {
    // Check if the word is an exception
    if (exceptions.has(word)) {
      return word;
    }
    // Otherwise, capitalize the first letter and lowercase the rest
    return word.charAt(0).toUpperCase() + word.slice(1).toLocaleLowerCase();
  });

  // 4. Join the words back together with a single space
  return capitalizedWords.join(" ");
};

/**
 * Truncates a string based on a specified word limit or character limit.
 *
 * This function allows you to truncate a string either by the number of words (`wordMax`)
 * or by the total number of characters (`textMax`). If the string exceeds the specified limit,
 * it appends ellipsis (`...`) by default unless `hideDots` is set to `true`.
 *
 * @param {Object} params - The parameters for truncating the string.
 * @param {string} params.text - The input string to truncate.
 * @param {number} [params.wordMax] - The maximum number of words allowed. If exceeded, the string is truncated.
 * @param {number} [params.textMax] - The maximum number of characters allowed. If exceeded, the string is truncated.
 * @param {boolean} [params.hideDots=false] - Whether to hide the ellipsis (`...`) when truncating. Defaults to `false`.
 *
 * @returns {string} - The truncated string. If no truncation is needed, the original string is returned.
 *
 * @example
 * // Truncate by word limit
 * truncateString({ text: "This is a long sentence that needs truncation.", wordMax: 5 });
 * // Output: "This is a long sentence..."
 *
 * @example
 * // Truncate by character limit
 * truncateString({ text: "This is a long sentence that needs truncation.", textMax: 20 });
 * // Output: "This is a long sent..."
 *
 * @example
 * // Truncate without ellipsis
 * truncateString({ text: "This is a long sentence that needs truncation.", wordMax: 5, hideDots: true });
 * // Output: "This is a long sentence"
 */
export function truncateString({
  text,
  wordMax,
  textMax,
  hideDots,
}: {
  text: string;
  wordMax?: number;
  textMax?: number;
  hideDots?: boolean;
}): string {
  if (!text?.length) {
    return text;
  }

  const words = text.split(" ");

  if (wordMax && words.length > wordMax) {
    return words.slice(0, wordMax).join(" ") + (hideDots ? "" : "...");
  }

  if (textMax && text.length > textMax) {
    return text.slice(0, textMax) + (hideDots ? "" : "...");
  }

  return text;
}

export const removeWhiteSpace = (str: string) => str.replace(/\s+/g, "");
