function downloadTranslation(filename, trans = {}) {
    const textDoc = JSON.stringify(trans, null, 2);
    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/html,${encodeURIComponent(textDoc)}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${filename}.json`;
    hiddenElement.click();
    return trans;
}

async function updateTranslation(filename) {
    try {
        const response = await fetch(`./translations/${filename}.json?${Math.random() * 100}`);
        if (!response.ok) return [false, {}];
        const data = await response.json();
        return [true, data];
    } catch (e) {
        console.error(e);
        return [false, {}];
    }
}

const updateList = [
    "blank", // must be first
    "en",
    "cs",
    "cn",
    "de",
    "es",
    "fr",
    "it",
    "ja",
    "eu",
    "nl",
    "pig",
    "pl",
    "pt",
    "pt-br",
    "ru",
    "tr",
    "uk",
    "ar",
    "hi"
];

// Initialize DOM selectors and defaults
const allItems = document.querySelectorAll('[data-translate]');
const allTitles = document.querySelectorAll('[title]');
const allPlaceholders = document.querySelectorAll('[placeholder]');

// Initialize default translations
const defaultTrans = {};
allItems.forEach((ele) => {
    const key = ele.dataset.translate;
    defaultTrans[key] = ele.innerHTML;
});

const defaultTransTitles = {};
allTitles.forEach((ele) => {
    const key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
    ele.dataset.key = key;
    defaultTransTitles[key] = ele.title;
});

const defaultTransPlaceholders = {};
allPlaceholders.forEach((ele) => {
    const key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
    ele.dataset.key = key;
    defaultTransPlaceholders[key] = ele.placeholder;
});

let counter = 0;
for (const lang of updateList) {
    setTimeout(async () => {
        console.log(`Processing ${lang}...`);
        const [success, data] = await updateTranslation(lang);
        
        if (success) {
            // Create output preserving ALL existing translations
            const outputTrans = {
                innerHTML: {...data.innerHTML},
                titles: {...data.titles},
                placeholders: {...data.placeholders}
            };

            // Only add NEW keys that don't exist in the translation file
            allItems.forEach(ele => {
                const key = ele.dataset.translate;
                if (!(key in outputTrans.innerHTML)) {
                    outputTrans.innerHTML[key] = defaultTrans[key];
                }
            });

            allTitles.forEach(ele => {
                const key = ele.dataset.key;
                if (!(key in outputTrans.titles)) {
                    outputTrans.titles[key] = defaultTransTitles[key];
                }
            });

            allPlaceholders.forEach(ele => {
                const key = ele.dataset.key;
                if (!(key in outputTrans.placeholders)) {
                    outputTrans.placeholders[key] = defaultTransPlaceholders[key];
                }
            });

            // Preserve miscellaneous section
            if (data.miscellaneous) {
                outputTrans.miscellaneous = {...data.miscellaneous};
            }

            downloadTranslation(lang, outputTrans);
        }
    }, counter);
    counter += 800;
}