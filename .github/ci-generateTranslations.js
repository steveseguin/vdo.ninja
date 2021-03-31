var https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require("axios").default;
const fs = require("fs");

const dom = new JSDOM(``, {
  url: "https://obs.ninja",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  pretendToBeVisual: true,
});

global.document = new JSDOM(``, {
  url: "https://obs.ninja",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000,
  pretendToBeVisual: false,
}).window.document;

function downloadTranslation(filename, trans = {}) {
  // downloads the current translation to a file
  console.log("Downloading translation: " + filename);
  const textDoc = JSON.stringify(trans, null, 2);

  fs.writeFile(`translations/${filename}.json`, textDoc, (err) => {
    if (err) {
      return console.log(err);
    }
  });

  return trans;
}

async function updateTranslation(filename) {
  // updates the website with a specific translation
  let data = await axios({
    method: "get",
    url: `https://raw.githubusercontent.com/steveseguin/obsninja/master/translations/${filename}.json?${(
      Math.random() * 100
    ).toString()}`,
  })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  const oldTransItems = data["innerHTML"];

  // const allItems1 = document.querySelectorAll('[data-translate]');

  allItems.forEach((ele) => {
    const key = ele.dataset.translate; //.replace(/[\W]+/g, "-").toLowerCase();
    if (key in oldTransItems) {
      ele.innerHTML = oldTransItems[key];
    }
  });

  const oldTransTitles = data["titles"];
  //const allTitles1 = document.querySelectorAll('[title]');
  allTitles.forEach((ele) => {
    const key = ele.dataset.key;
    //const key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
    if (key in oldTransTitles) {
      ele.title = oldTransTitles[key];
    }
  });

  const oldTransPlaceholders = data.placeholders;
  //const allPlaceholders1 = document.querySelectorAll('[placeholder]');
  allPlaceholders.forEach((ele) => {
    const key = ele.dataset.key;
    //const key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
    if (key in oldTransPlaceholders) {
      ele.placeholder = oldTransPlaceholders[key];
    }
  });

  return [true, data];
}

const updateList = [
  "cs",
  "de",
  "en",
  "es",
  "fr",
  "it",
  "ja",
  "nl",
  "pig",
  "pt",
  "ru",
  "tr",
  "blank",
]; // list of languages to update. Update this if you add a new language.

const allItems = document.querySelectorAll("[data-translate]");
const defaultTrans = {};
allItems.forEach((ele) => {
  const key = ele.dataset.translate; //.replace(/[\W]+/g, "-").toLowerCase();
  defaultTrans[key] = ele.innerHTML;
});

const defaultTransTitles = {};
const allTitles = document.querySelectorAll("[title]");
allTitles.forEach((ele) => {
  const key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
  ele.dataset.key = key;
  defaultTransTitles[key] = ele.title;
});

const defaultTransPlaceholders = {};
const allPlaceholders = document.querySelectorAll("[placeholder]");
allPlaceholders.forEach((ele) => {
  const key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
  ele.dataset.key = key;
  defaultTransPlaceholders[key] = ele.placeholder;
});

const combinedTrans = {};
combinedTrans.titles = defaultTransTitles;
combinedTrans.innerHTML = defaultTrans;
combinedTrans.placeholders = defaultTransPlaceholders;

var counter = 0;
for (var i = 0; i < updateList.length; i++) {
  const lang = updateList[i];

  var translation = updateTranslation(lang); // we don't need to worry about DATA.
  updateTranslation(lang)
    .then((translation) => {
      const newTrans = translation[1]["innerHTML"];
      //const allItems = document.querySelectorAll('[data-translate]');
      allItems.forEach((ele) => {
        const key = ele.dataset.translate; //.replace(/[\W]+/g, "-").toLowerCase();
        newTrans[key] = ele.innerHTML;
      });

      const newTransTitles = translation[1]["titles"];
      //const allTitles = document.querySelectorAll('[title]');
      allTitles.forEach((ele) => {
        const key = ele.dataset.key;
        newTransTitles[key] = ele.title;
      });

      const newPlaceholders = translation[1]["placeholders"];
      // const allPlaceholders = document.querySelectorAll('[placeholder]');
      allPlaceholders.forEach((ele) => {
        const key = ele.dataset.key;
        newPlaceholders[key] = ele.placeholder;
      });

      // //// DOWNLOAD UPDATED TRANSLATION
      const outputTrans = {};
      outputTrans["titles"] = newTransTitles;
      outputTrans["innerHTML"] = newTrans;
      outputTrans["placeholders"] = newPlaceholders;
      downloadTranslation(lang, outputTrans);
    })
    .catch((error) => {
      console.log(error);
    });
}
