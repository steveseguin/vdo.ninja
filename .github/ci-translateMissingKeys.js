const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const translationsDir = path.join(rootDir, "translations");
const sourceFiles = (process.env.TRANSLATION_SOURCE_FILES || "index.html,main.js")
  .split(",")
  .map((file) => file.trim())
  .filter(Boolean);
const targetLanguagesInput = (process.env.TARGET_LANGUAGES || "all")
  .split(",")
  .map((language) => language.trim())
  .filter(Boolean);
const maxKeys = Number.parseInt(process.env.MAX_TRANSLATION_KEYS || "50", 10);
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const previewApiInDryRun =
  process.env.PREVIEW_API_IN_DRY_RUN === "1" ||
  process.env.PREVIEW_API_IN_DRY_RUN === "true";
const previewSampleLimit = Number.parseInt(
  process.env.TRANSLATION_PREVIEW_SAMPLES || "3",
  10
);
const apiProviderInput = (
  process.env.TRANSLATION_API_PROVIDER ||
  process.env.ZAI_API_PROVIDER ||
  ""
).toLowerCase();
const apiToken =
  process.env.TRANSLATION_API_TOKEN ||
  process.env.OPENCODE_ZEN_API_TOKEN ||
  process.env.OC_API_KEY ||
  process.env.ZAI_API_TOKEN;
const apiUrl =
  process.env.TRANSLATION_API_URL ||
  process.env.ZAI_API_URL ||
  "https://opencode.ai/zen/v1/chat/completions";
const apiProvider =
  apiProviderInput ||
  (apiUrl.includes("opencode.ai/zen")
    ? "opencode"
    : apiUrl.includes("api.z.ai")
      ? "zai"
      : "openai-compatible");
const defaultModelChain =
  apiProvider === "zai"
    ? "glm-5.1"
    : "deepseek-v4-flash-free,nemotron-3-super-free,big-pickle,minimax-m2.7";
const modelChain = (
  process.env.TRANSLATION_MODELS ||
  process.env.TRANSLATION_MODEL ||
  process.env.ZAI_MODEL ||
  defaultModelChain
)
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
const usedRemoteModels = new Set();

const languageNames = {
  ar: "Arabic",
  blank: "English template",
  cn: "Simplified Chinese",
  cs: "Czech",
  de: "German",
  en: "English",
  es: "Spanish",
  eu: "Basque",
  fr: "French",
  hi: "Hindi",
  it: "Italian",
  ja: "Japanese",
  kr: "Korean",
  nl: "Dutch",
  pig: "Pig Latin",
  pl: "Polish",
  pt: "Portuguese",
  "pt-br": "Brazilian Portuguese",
  ru: "Russian",
  tr: "Turkish",
  uk: "Ukrainian",
};

const expected = {
  innerHTML: {},
  titles: {},
  placeholders: {},
};

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\"",
  };

  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity[0] === "#") {
      const isHex = entity[1] && entity[1].toLowerCase() === "x";
      const codePoint = parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return Object.prototype.hasOwnProperty.call(namedEntities, entity)
      ? namedEntities[entity]
      : match;
  });
}

function unescapeSourceString(value) {
  return value
    .replace(/\\(["'])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function keyFromVisibleText(value) {
  return decodeHtmlEntities(unescapeSourceString(value))
    .replace(/[\W]+/g, "-")
    .toLowerCase();
}

function hasKeyCharacters(key) {
  return /[a-z0-9_]/i.test(key);
}

function extractAttributeValues(source, attributeName) {
  const values = [];
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`\\b${escapedName}\\s*=\\s*`, "gi");
  let match;

  while ((match = matcher.exec(source)) !== null) {
    let index = matcher.lastIndex;
    while (index < source.length && /\s/.test(source[index])) {
      index += 1;
    }

    let value = "";
    const first = source[index];
    const second = source[index + 1];

    if (first === "\\" && (second === "\"" || second === "'")) {
      const close = `\\${second}`;
      index += 2;
      const end = source.indexOf(close, index);
      if (end === -1) {
        continue;
      }
      value = source.slice(index, end);
      matcher.lastIndex = end + close.length;
    } else if (first === "\"" || first === "'") {
      const close = first;
      index += 1;
      let end = index;
      while (end < source.length) {
        if (source[end] === close && source[end - 1] !== "\\") {
          break;
        }
        end += 1;
      }
      if (end >= source.length) {
        continue;
      }
      value = source.slice(index, end);
      matcher.lastIndex = end + 1;
    } else {
      let end = index;
      while (end < source.length && !/[\s>/]/.test(source[end])) {
        end += 1;
      }
      value = source.slice(index, end);
      matcher.lastIndex = end;
    }

    values.push(value);
  }

  return values;
}

function extractHtmlLikeTags(source) {
  const tags = [];

  for (let index = 0; index < source.length; index += 1) {
    if (source[index] !== "<" || !/[a-zA-Z/!]/.test(source[index + 1] || "")) {
      continue;
    }

    const end = source.indexOf(">", index + 1);
    if (end === -1) {
      break;
    }

    tags.push(source.slice(index, end + 1));
    index = end;
  }

  return tags;
}

function stripOuterWhitespace(value) {
  return value.replace(/^\s+|\s+$/g, "");
}

function addExpectedInnerHtml(source) {
  const sourceForMatching = unescapeSourceString(source);
  const matcher =
    /<([a-zA-Z][\w:-]*)([^>]*)\bdata-translate\s*=\s*(["'])(.*?)\3([^>]*)>/gi;
  let match;

  while ((match = matcher.exec(sourceForMatching)) !== null) {
    const tagName = match[1];
    const key = decodeHtmlEntities(unescapeSourceString(match[4])).trim();
    if (!key || match[4].includes("${") || !hasKeyCharacters(key)) {
      continue;
    }

    const tagEnd = matcher.lastIndex;
    const closeTag = new RegExp(`</${tagName}\\s*>`, "i");
    const closeMatch = closeTag.exec(sourceForMatching.slice(tagEnd));
    const value = closeMatch
      ? stripOuterWhitespace(sourceForMatching.slice(tagEnd, tagEnd + closeMatch.index))
      : "";

    expected.innerHTML[key] = value;
  }
}

function addExpectedKeysFromSource(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const htmlSource = extractHtmlLikeTags(source).join("\n");

  addExpectedInnerHtml(source);

  extractAttributeValues(htmlSource, "title").forEach((value) => {
    const key = keyFromVisibleText(value);
    if (key && !value.includes("${") && hasKeyCharacters(key)) {
      expected.titles[key] = decodeHtmlEntities(unescapeSourceString(value));
    }
  });

  extractAttributeValues(htmlSource, "placeholder").forEach((value) => {
    const key = keyFromVisibleText(value);
    if (key && !value.includes("${") && hasKeyCharacters(key)) {
      expected.placeholders[key] = decodeHtmlEntities(unescapeSourceString(value));
    }
  });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function ensureSection(data, section) {
  if (!data[section] || typeof data[section] !== "object" || Array.isArray(data[section])) {
    data[section] = {};
  }
}

function hasSectionedTranslationShape(data) {
  return ["innerHTML", "titles", "placeholders"].some(
    (section) =>
      data[section] &&
      typeof data[section] === "object" &&
      !Array.isArray(data[section])
  );
}

function getSourceValue(section, key, fallbackFiles) {
  if (Object.prototype.hasOwnProperty.call(expected[section], key)) {
    return expected[section][key];
  }

  for (const fallback of fallbackFiles) {
    if (
      fallback[section] &&
      Object.prototype.hasOwnProperty.call(fallback[section], key)
    ) {
      return fallback[section][key];
    }
  }

  return key;
}

function getTargetLanguageFiles() {
  const allFiles = fs
    .readdirSync(translationsDir)
    .filter((file) => file.endsWith(".json") && file !== "default.json")
    .sort();

  if (targetLanguagesInput.length === 1 && targetLanguagesInput[0] === "all") {
    return allFiles;
  }

  const wanted = new Set(
    targetLanguagesInput.map((language) =>
      language.endsWith(".json") ? language : `${language}.json`
    )
  );
  return allFiles.filter((file) => wanted.has(file));
}

function collectMissingEntries(targetFiles, fallbackFiles) {
  const entries = [];

  for (const file of targetFiles) {
    const filePath = path.join(translationsDir, file);
    const data = readJson(filePath);

    if (!hasSectionedTranslationShape(data)) {
      continue;
    }

    ["innerHTML", "titles", "placeholders"].forEach((section) => {
      ensureSection(data, section);
      Object.keys(expected[section]).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(data[section], key)) {
          return;
        }
        entries.push({
          file,
          languageCode: file.replace(/\.json$/, ""),
          section,
          key,
          source: getSourceValue(section, key, fallbackFiles),
        });
      });
    });
  }

  return entries.slice(0, maxKeys);
}

function groupEntries(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    if (!grouped.has(entry.file)) {
      grouped.set(entry.file, []);
    }
    grouped.get(entry.file).push(entry);
  });

  return grouped;
}

function parseJsonObject(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw error;
  }
}

function collectMatches(value, pattern) {
  const matches = [];
  let match;
  while ((match = pattern.exec(value)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

function extractPreservedTokens(value) {
  const text = String(value || "");
  return [
    ...collectMatches(text, /<\/?[a-zA-Z][^>]*>/g),
    ...collectMatches(text, /&(?:#x?[0-9a-fA-F]+|[a-zA-Z]+);/g),
    ...collectMatches(text, /https?:\/\/[^\s"'<>]+/g),
    ...collectMatches(text, /\$\{[^}]+\}/g),
    ...collectMatches(text, /\{\{[^}]+\}\}/g),
    ...collectMatches(text, /%[sdifjoO]/g),
  ];
}

function validateTranslatedValue(entry, value) {
  if (typeof value !== "string") {
    throw new Error(
      `${apiProvider} returned a non-string value for ${entry.file} ${entry.section}.${entry.key}`
    );
  }

  if (String(entry.source).trim() && !value.trim()) {
    throw new Error(
      `${apiProvider} returned an empty translation for ${entry.file} ${entry.section}.${entry.key}`
    );
  }

  const missingTokens = extractPreservedTokens(entry.source).filter(
    (token) => !value.includes(token)
  );
  if (missingTokens.length > 0) {
    throw new Error(
      `${apiProvider} changed preserved tokens for ${entry.file} ${entry.section}.${entry.key}: ${missingTokens.join(", ")}`
    );
  }
}

function normalizeTranslatedBatch(languageCode, entries, translated) {
  if (!translated || typeof translated !== "object" || Array.isArray(translated)) {
    throw new Error(`${apiProvider} response for ${languageCode} was not a JSON object`);
  }

  const expectedKeys = new Set(
    entries.map((entry) => `${entry.section}.${entry.key}`)
  );

  if (
    translated.strings &&
    typeof translated.strings === "object" &&
    !Array.isArray(translated.strings)
  ) {
    const nestedHasExpectedKeys = [...expectedKeys].some((key) =>
      Object.prototype.hasOwnProperty.call(translated.strings, key)
    );
    if (nestedHasExpectedKeys) {
      console.log(`Using nested strings object from ${apiProvider} response.`);
      translated = translated.strings;
    }
  }

  const extraKeys = Object.keys(translated).filter((key) => !expectedKeys.has(key));
  if (extraKeys.length > 0) {
    console.log(
      `Ignoring unexpected ${apiProvider} keys for ${languageCode}: ${extraKeys.join(", ")}`
    );
  }

  const normalized = {};
  entries.forEach((entry) => {
    const compoundKey = `${entry.section}.${entry.key}`;
    if (!Object.prototype.hasOwnProperty.call(translated, compoundKey)) {
      throw new Error(`${apiProvider} response missed required key: ${compoundKey}`);
    }
    validateTranslatedValue(entry, translated[compoundKey]);
    normalized[compoundKey] = translated[compoundKey];
  });

  return normalized;
}

function oneLine(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 220);
}

function logPreviewSamples(file, entries, translated) {
  if (!dryRun || !previewApiInDryRun || previewSampleLimit < 1) {
    return;
  }

  entries.slice(0, previewSampleLimit).forEach((entry) => {
    const compoundKey = `${entry.section}.${entry.key}`;
    if (!Object.prototype.hasOwnProperty.call(translated, compoundKey)) {
      return;
    }
    console.log(`Preview ${file} ${compoundKey}`);
    console.log(`  Source: ${oneLine(entry.source)}`);
    console.log(`  Output: ${oneLine(translated[compoundKey])}`);
  });
}

function localTemplateValue(languageCode, source) {
  if (languageCode === "blank" || languageCode === "en") {
    return source;
  }
  return null;
}

async function translateBatch(languageCode, entries, selectedModel) {
  const languageName = languageNames[languageCode] || languageCode;
  const requested = {};

  entries.forEach((entry) => {
    requested[`${entry.section}.${entry.key}`] = entry.source;
  });

  const messages = [
    {
      role: "system",
      content:
        "You translate UI strings for VDO.Ninja. Return only a flat JSON object. The output object's property names must exactly match the input strings object's property names. Do not include targetLanguage, strings, explanations, markdown, or nested objects. Preserve HTML tags, attributes, entities, product names, keyboard shortcuts, URLs, variable-looking tokens, and emoji. Translate visible human-readable text only.",
    },
    {
      role: "user",
      content: JSON.stringify({
        targetLanguage: languageName,
        strings: requested,
      }),
    },
  ];
  const payload = {
    model: selectedModel,
    stream: false,
    temperature: 0.2,
    response_format: {
      type: "json_object",
    },
    messages,
  };

  if (apiProvider === "zai") {
    payload.do_sample = false;
    payload.thinking = {
      type: "disabled",
    };
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      `${apiProvider} request failed: ${response.status} ${await response.text()}`
    );
  }

  const data = await response.json();
  const content =
    data.choices &&
    data.choices[0] &&
    data.choices[0].message &&
    data.choices[0].message.content;

  if (!content) {
    throw new Error(
      `${apiProvider} response did not include choices[0].message.content`
    );
  }

  return parseJsonObject(content);
}

async function translateBatchWithFallback(languageCode, entries) {
  let lastError = null;

  for (const selectedModel of modelChain) {
    try {
      console.log(
        `Trying ${apiProvider} model ${selectedModel} for ${languageCode}: ${entries.length} keys`
      );
      const translated = normalizeTranslatedBatch(
        languageCode,
        entries,
        await translateBatch(languageCode, entries, selectedModel)
      );
      usedRemoteModels.add(selectedModel);
      return translated;
    } catch (error) {
      lastError = error;
      console.log(
        `Model ${selectedModel} failed for ${languageCode}: ${error.message}`
      );
    }
  }

  throw new Error(
    `All translation models failed for ${languageCode}. Last error: ${
      lastError ? lastError.message : "none"
    }`
  );
}

async function translateEntriesForFile(file, entries) {
  const languageCode = file.replace(/\.json$/, "");
  const translated = {};
  const remoteEntries = [];

  entries.forEach((entry) => {
    const localValue = localTemplateValue(languageCode, entry.source);
    if (localValue !== null) {
      translated[`${entry.section}.${entry.key}`] = localValue;
    } else {
      remoteEntries.push(entry);
    }
  });

  if (remoteEntries.length === 0) {
    return translated;
  }

  if (dryRun && !previewApiInDryRun) {
    remoteEntries.forEach((entry) => {
      translated[`${entry.section}.${entry.key}`] = entry.source;
    });
    return translated;
  }

  if (!apiToken) {
    throw new Error(
      "TRANSLATION_API_TOKEN, OPENCODE_ZEN_API_TOKEN, OC_API_KEY, or ZAI_API_TOKEN is required unless DRY_RUN is enabled without PREVIEW_API_IN_DRY_RUN"
    );
  }

  const remoteTranslated = await translateBatchWithFallback(
    languageCode,
    remoteEntries
  );
  return { ...translated, ...remoteTranslated };
}

function applyTranslations(file, entries, translated) {
  const filePath = path.join(translationsDir, file);
  const data = readJson(filePath);

  entries.forEach((entry) => {
    ensureSection(data, entry.section);
    const compoundKey = `${entry.section}.${entry.key}`;
    data[entry.section][entry.key] =
      Object.prototype.hasOwnProperty.call(translated, compoundKey)
        ? translated[compoundKey]
        : entry.source;
  });

  if (!dryRun) {
    writeJson(filePath, data);
  }
}

async function main() {
  if (!Number.isFinite(maxKeys) || maxKeys < 1) {
    throw new Error("MAX_TRANSLATION_KEYS must be a positive integer");
  }

  sourceFiles.forEach((file) => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Translation source file not found: ${file}`);
    }
    addExpectedKeysFromSource(filePath);
  });

  if (modelChain.length === 0) {
    throw new Error("At least one translation model must be configured");
  }

  const fallbackFiles = ["blank.json", "en.json"]
    .map((file) => path.join(translationsDir, file))
    .filter((filePath) => fs.existsSync(filePath))
    .map((filePath) => readJson(filePath));
  const targetFiles = getTargetLanguageFiles();
  const entries = collectMissingEntries(targetFiles, fallbackFiles);
  const grouped = groupEntries(entries);

  console.log(`Model chain: ${modelChain.join(" -> ")}`);
  console.log(`API provider: ${apiProvider}`);
  console.log(`Dry run: ${dryRun ? "yes" : "no"}`);
  console.log(
    `Preview API in dry run: ${dryRun && previewApiInDryRun ? "yes" : "no"}`
  );
  console.log(`Target files: ${targetFiles.join(", ")}`);
  console.log(`Missing keys selected: ${entries.length}`);

  for (const [file, fileEntries] of grouped.entries()) {
    console.log(`Updating ${file}: ${fileEntries.length} keys`);
    const translated = await translateEntriesForFile(file, fileEntries);
    logPreviewSamples(file, fileEntries, translated);
    applyTranslations(file, fileEntries, translated);
  }

  if (entries.length === 0) {
    console.log("No missing translation keys found for the selected targets.");
  } else if (dryRun) {
    console.log("Dry run completed without writing files.");
  } else {
    console.log("Translation files updated.");
  }

  if (usedRemoteModels.size > 0) {
    console.log(`Remote models used: ${[...usedRemoteModels].join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
