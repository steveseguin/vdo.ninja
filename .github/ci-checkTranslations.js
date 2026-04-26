const fs = require("fs");
const path = require("path");

const translationsDir = "translations";

// Load en.json as source of truth
const en = JSON.parse(fs.readFileSync(path.join(translationsDir, "en.json"), "utf8"));

// Recursively get all keys as "section.key"
function getAllKeys(obj, prefix = "") {
  const keys = new Set();
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null) {
      getAllKeys(v, fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }
  return keys;
}

const enKeys = getAllKeys(en);
const missingReport = {};

// Check every translation file except en.json
const files = fs.readdirSync(translationsDir).filter(
  f => f.endsWith(".json") && f !== "en.json" && f !== "blank.json" && f !== "default.json"
);

for (const filename of files) {
  const lang = filename.replace(".json", "");
  const langData = JSON.parse(
    fs.readFileSync(path.join(translationsDir, filename), "utf8")
  );
  const langKeys = getAllKeys(langData);

  const missing = [...enKeys].filter(k => !langKeys.has(k));
  if (missing.length > 0) {
    missingReport[lang] = missing.sort();
  }
}

// Print report
if (Object.keys(missingReport).length === 0) {
  console.log("✅ All translation files are complete!");
  process.exit(0);
}

let output = "## ⚠️ Missing Translation Keys\n\n";
for (const [lang, keys] of Object.entries(missingReport)) {
  output += `### \`${lang}.json\` — ${keys.length} missing keys\n`;
  keys.forEach(k => (output += `- \`${k}\`\n`));
  output += "\n";
}

console.log(output);

fs.writeFileSync(".github/translation_report.md", output);

process.exit(1); // fail the check so PR shows warning