const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const translationsDir = path.join(rootDir, "translations");
const sourceFiles = (process.env.TRANSLATION_SOURCE_FILES || "index.html,main.js")
  .split(",")
  .map((file) => file.trim())
  .filter(Boolean);
const baselinePath = process.env.TRANSLATION_KEY_BASELINE
  ? path.resolve(rootDir, process.env.TRANSLATION_KEY_BASELINE)
  : path.join(__dirname, "translation-key-baseline.json");
const skipFiles = new Set(
  (process.env.TRANSLATION_SKIP_FILES || "default.json")
    .split(",")
    .map((file) => file.trim())
    .filter(Boolean)
);

const expected = {
  innerHTML: new Set(),
  titles: new Set(),
  placeholders: new Set(),
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

    if ((first === "\\" && (second === "\"" || second === "'"))) {
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

function hasKeyCharacters(key) {
  return /[a-z0-9_]/i.test(key);
}

function addExpectedKeysFromSource(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const htmlSource = extractHtmlLikeTags(source).join("\n");

  extractAttributeValues(htmlSource, "data-translate").forEach((value) => {
    const key = decodeHtmlEntities(unescapeSourceString(value)).trim();
    if (key && !value.includes("${") && hasKeyCharacters(key)) {
      expected.innerHTML.add(key);
    }
  });

  extractAttributeValues(htmlSource, "title").forEach((value) => {
    const key = keyFromVisibleText(value);
    if (key && !value.includes("${") && hasKeyCharacters(key)) {
      expected.titles.add(key);
    }
  });

  extractAttributeValues(htmlSource, "placeholder").forEach((value) => {
    const key = keyFromVisibleText(value);
    if (key && !value.includes("${") && hasKeyCharacters(key)) {
      expected.placeholders.add(key);
    }
  });
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function hasSectionedTranslationShape(data) {
  return ["innerHTML", "titles", "placeholders"].some(
    (section) =>
      data[section] &&
      typeof data[section] === "object" &&
      !Array.isArray(data[section])
  );
}

function getMissingKeys(data, section) {
  const sectionData =
    data[section] && typeof data[section] === "object" && !Array.isArray(data[section])
      ? data[section]
      : {};

  return [...expected[section]].filter(
    (key) => !Object.prototype.hasOwnProperty.call(sectionData, key)
  );
}

function formatKeyList(keys) {
  return keys.map((key) => `- \`${key}\``).join("\n");
}

function sortMissingObject(missing) {
  const sorted = {};
  Object.keys(missing)
    .sort()
    .forEach((file) => {
      sorted[file] = {};
      ["innerHTML", "titles", "placeholders"].forEach((section) => {
        const keys = missing[file][section] || [];
        if (keys.length > 0) {
          sorted[file][section] = [...keys].sort();
        }
      });
    });
  return sorted;
}

function toMissingObject(missingByFile) {
  const missing = {};
  missingByFile.forEach(({ file, missing: sections }) => {
    missing[file] = {};
    Object.entries(sections).forEach(([section, keys]) => {
      if (keys.length > 0) {
        missing[file][section] = [...keys].sort();
      }
    });
  });
  return sortMissingObject(missing);
}

function toMissingArray(missing) {
  return Object.entries(missing).map(([file, sections]) => ({
    file,
    missing: {
      innerHTML: sections.innerHTML || [],
      titles: sections.titles || [],
      placeholders: sections.placeholders || [],
    },
  }));
}

function countMissing(missing) {
  return Object.values(missing).reduce(
    (fileTotal, sections) =>
      fileTotal +
      Object.values(sections).reduce((sectionTotal, keys) => sectionTotal + keys.length, 0),
    0
  );
}

function subtractBaseline(currentMissing, baselineMissing) {
  const newMissing = {};

  Object.entries(currentMissing).forEach(([file, sections]) => {
    Object.entries(sections).forEach(([section, keys]) => {
      const baselineKeys = new Set(
        baselineMissing[file] && baselineMissing[file][section]
          ? baselineMissing[file][section]
          : []
      );
      const missingKeys = keys.filter((key) => !baselineKeys.has(key));
      if (missingKeys.length === 0) {
        return;
      }
      if (!newMissing[file]) {
        newMissing[file] = {};
      }
      newMissing[file][section] = missingKeys;
    });
  });

  return sortMissingObject(newMissing);
}

function loadBaseline() {
  if (!fs.existsSync(baselinePath)) {
    return null;
  }
  return readJson(baselinePath).missing || {};
}

function writeBaseline(missing) {
  const baseline = {
    description:
      "Known translation-key gaps. ci-checkTranslationKeys.js fails only on missing keys not listed here.",
    sourceFiles,
    missing: sortMissingObject(missing),
  };
  fs.writeFileSync(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
}

function buildReport(currentMissing, newMissing, hasBaseline) {
  const counts = Object.fromEntries(
    Object.entries(expected).map(([section, keys]) => [section, keys.size])
  );
  let report = "# Translation Key Check\n\n";
  report += "Expected keys were extracted from ";
  report += sourceFiles.map((file) => `\`${file}\``).join(", ");
  report += " using the same key rules as `translations/translate.js`.\n\n";
  report += `- innerHTML keys: ${counts.innerHTML}\n`;
  report += `- title keys: ${counts.titles}\n`;
  report += `- placeholder keys: ${counts.placeholders}\n\n`;

  const currentMissingCount = countMissing(currentMissing);
  const newMissingCount = countMissing(newMissing);

  if (hasBaseline) {
    report += `Known/current missing keys: ${currentMissingCount}\n`;
    report += `New missing keys: ${newMissingCount}\n\n`;
  }

  if (currentMissingCount === 0) {
    report += "All checked translation files include the expected keys.\n";
    return report;
  }

  if (hasBaseline && newMissingCount === 0) {
    report +=
      "No new missing keys were found. Existing gaps are tracked in the translation-key baseline.\n";
    return report;
  }

  report += hasBaseline ? "New missing keys found:\n\n" : "Missing keys found:\n\n";
  toMissingArray(hasBaseline ? newMissing : currentMissing).forEach(({ file, missing }) => {
    const total = Object.values(missing).reduce((sum, keys) => sum + keys.length, 0);
    report += `## ${file} (${total} missing)\n\n`;
    Object.entries(missing).forEach(([section, keys]) => {
      if (keys.length === 0) {
        return;
      }
      report += `### ${section} (${keys.length})\n\n`;
      report += `${formatKeyList(keys)}\n\n`;
    });
  });

  return report;
}

sourceFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Translation source file not found: ${file}`);
  }
  addExpectedKeysFromSource(filePath);
});

const translationFiles = fs
  .readdirSync(translationsDir)
  .filter((file) => file.endsWith(".json") && !skipFiles.has(file))
  .sort();

const missingByFile = [];
const skippedFiles = [];

translationFiles.forEach((file) => {
  const filePath = path.join(translationsDir, file);
  const data = readJson(filePath);

  if (!hasSectionedTranslationShape(data)) {
    skippedFiles.push(file);
    return;
  }

  const missing = {
    innerHTML: getMissingKeys(data, "innerHTML"),
    titles: getMissingKeys(data, "titles"),
    placeholders: getMissingKeys(data, "placeholders"),
  };
  const missingCount = Object.values(missing).reduce(
    (sum, keys) => sum + keys.length,
    0
  );

  if (missingCount > 0) {
    missingByFile.push({ file, missing });
  }
});

const currentMissing = toMissingObject(missingByFile);
const baselineMissing = loadBaseline();
const hasBaseline = baselineMissing !== null;
const newMissing = hasBaseline
  ? subtractBaseline(currentMissing, baselineMissing)
  : currentMissing;
const report = buildReport(currentMissing, newMissing, hasBaseline);
console.log(report);

if (skippedFiles.length > 0) {
  console.log(
    `Skipped non-sectioned translation files: ${skippedFiles.join(", ")}`
  );
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
}

if (process.env.TRANSLATION_UPDATE_BASELINE === "1") {
  writeBaseline(currentMissing);
  console.log(`Updated translation-key baseline: ${baselinePath}`);
  process.exit(0);
}

if (countMissing(newMissing) > 0) {
  process.exit(1);
}
