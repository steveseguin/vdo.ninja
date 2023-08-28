/* function getAllContentNodes(element) { // takes an element.
	
	element.childNodes.forEach(node=>{
		if (node.childNodes.length){
			if (node.dataset.translate){return;}
			getAllContentNodes(node)
		} else if ((node.nodeType === 3) && node.textContent && (node.textContent.trim().length > 0)){
			var datatag = node.textContent.toLowerCase().replace(/[^a-zA-Z0-9\s\-]/g, '').trim().replaceAll(" ","-");
			if (datatag){
				var newNode = document.createElement("span");
				newNode.dataset.translate = datatag;
				newNode.innerHTML = node.textContent;
				node.parentNode.replaceChild(newNode, node);
				
			}
			
		} 
	});
}
getAllContentNodes(document.body)

 */
// Copy and paste this code into VDO.Ninja's developer's console to generate new Translation files

function downloadTranslation(filename, trans = {}) { // downloads the current translation to a file

    const textDoc = JSON.stringify(trans, null, 2);

    const hiddenElement = document.createElement('a');

    hiddenElement.href = `data:text/html,${
        encodeURIComponent(textDoc)
    }`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `${filename}.json`;
    hiddenElement.click();

    return trans;
}


function updateTranslation(filename) { // updates the website with a specific translation
    const request = new XMLHttpRequest();
    request.open('GET', `./translations/${filename}.json?${
        (Math.random() * 100).toString()
    }`, false); // `false` makes the request synchronous
    request.send(null);

    if (request.status !== 200) {
        return false, {};
    }
    try {
        var data = JSON.parse(request.responseText);
    } catch (e) {
        console.log(request.responseText);
        console.error(e);
        return false, {};
    }

    const oldTransItems = data.innerHTML;
   // const allItems1 = document.querySelectorAll('[data-translate]');

    allItems.forEach((ele) => {
		const key = ele.dataset.translate;//.replace(/[\W]+/g, "-").toLowerCase();
        if (key in oldTransItems) {
            ele.innerHTML = oldTransItems[key];
        }
    });

    const oldTransTitles = data.titles;
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
    "pt",
	"pt-br",
    "ru",
    "tr",
	"uk"
]; // list of languages to update. Update this if you add a new language.

const allItems = document.querySelectorAll('[data-translate]');
const defaultTrans = {};
allItems.forEach((ele) => {
    const key = ele.dataset.translate;//.replace(/[\W]+/g, "-").toLowerCase();
    defaultTrans[key] = ele.innerHTML;
});

const defaultTransTitles = {};
const allTitles = document.querySelectorAll('[title]');
allTitles.forEach((ele) => {
	const key = ele.title.replace(/[\W]+/g, "-").toLowerCase();
	ele.dataset.key = key;
    defaultTransTitles[key] = ele.title;
});

const defaultTransPlaceholders = {};
const allPlaceholders = document.querySelectorAll('[placeholder]');
allPlaceholders.forEach((ele) => {
	const key = ele.placeholder.replace(/[\W]+/g, "-").toLowerCase();
	ele.dataset.key = key;
    defaultTransPlaceholders[key] = ele.placeholder;
});

//const combinedTrans = {};
//combinedTrans.titles = defaultTransTitles;
//combinedTrans.innerHTML = defaultTrans;
//combinedTrans.placeholders = defaultTransPlaceholders;




var counter = 0;
for (const i in updateList) {
    const lang = updateList[i];
    setTimeout((ln) => {
        var success = updateTranslation(ln); // we don't need to worry about DATA.
        if (success[0] == true) {
            const newTrans = success[1].innerHTML;
            //const allItems = document.querySelectorAll('[data-translate]');
            allItems.forEach((ele) => {
                const key = ele.dataset.translate;//.replace(/[\W]+/g, "-").toLowerCase();
                newTrans[key] = ele.innerHTML;
            });
			if (lang == "blank" || lang == "en"){
				console.log(newTrans);
				for (var key in newTrans) {
					if (!(key in defaultTrans)){
						defaultTrans[key] = newTrans[key];
					}
				}
			}  else {
				for (var key in defaultTrans){
					if (!(key in newTrans)){
						newTrans[key] = defaultTrans[key]
					}
				}
			}

            const newTransTitles = success[1].titles;
            //const allTitles = document.querySelectorAll('[title]');
            allTitles.forEach((ele) => {
                const key = ele.dataset.key;
                newTransTitles[key] = ele.title;
            });
			if (lang == "blank" || lang == "en"){
				for (var key in newTransTitles) {
					if (!(key in defaultTransTitles)){
						defaultTransTitles[key] = newTransTitles[key];
					}
				}
			} else {
				for (var key in defaultTransTitles){
					if (!(key in newTransTitles)){
						newTransTitles[key] = defaultTransTitles[key]
					}
				}
			}

            const newPlaceholders = success[1].placeholders;
           // const allPlaceholders = document.querySelectorAll('[placeholder]');
            allPlaceholders.forEach((ele) => {
                const key = ele.dataset.key;
                newPlaceholders[key] = ele.placeholder;
            });
			if (lang == "blank" || lang == "en"){
				for (var key in newPlaceholders) {
					if (!(key in defaultTransPlaceholders)){
						defaultTransPlaceholders[key] = newPlaceholders[key];
					}
				}
			} else {
				for (var key in defaultTransPlaceholders){
					if (!(key in newPlaceholders)){
						newPlaceholders[key] = defaultTransPlaceholders[key]
					}
				}
			}
			
			var miscellaneous = {};
			if ("miscellaneous" in success[1]){
				miscellaneous = success[1].miscellaneous; // don't lose our old copy.
				if (miscTranslations){
					Object.keys(miscTranslations).forEach(key => {
						if (!(key in success[1].miscellaneous)){
							miscellaneous[key] = miscTranslations[key];
						}
					});
				}
			} else if (miscTranslations){
				miscellaneous = miscTranslations;
			}

			Object.keys(miscellaneous).forEach(key => {
				if (key in newTrans){ // lets delete misc item, since it exists in innerHTMl as an option. don't want to double translate if not needed
					delete miscellaneous[key];
				}
			})

            // //// DOWNLOAD UPDATED TRANSLATION
            const outputTrans = {};
			outputTrans.titles = defaultTransTitles;
			outputTrans.innerHTML = defaultTrans;
			outputTrans.placeholders = defaultTransPlaceholders;
			
			
			for (var key in newTrans) {
				outputTrans.innerHTML[key] = newTrans[key];
			}
			for (var key in newTransTitles) {
				outputTrans.titles[key] = newTransTitles[key];
			}
			for (var key in newPlaceholders) {
				outputTrans.placeholders[key] = newPlaceholders[key];
			}
			
			//outputTrans.titles = newTransTitles;
           // outputTrans.innerHTML = newTrans;
			//outputTrans.placeholders = newPlaceholders;
			outputTrans.miscellaneous = miscellaneous;
            downloadTranslation(ln, outputTrans);
        }
        // //////// RESET THING BACK
        allItems.forEach((ele) => {
			const key = ele.dataset.translate;//.replace(/[\W]+/g, "-").toLowerCase();
            if (key in defaultTrans) {
                ele.innerHTML = defaultTrans[key];
            }
        });
        allTitles.forEach((ele) => {
            const key = ele.dataset.key;
            if (key in defaultTransTitles) {
                ele.title = defaultTransTitles[key];
            }
        });
        allPlaceholders.forEach((ele) => {
            const key = ele.dataset.key;
            if (key in defaultTransPlaceholders) {
                ele.placeholder = defaultTransPlaceholders[key];
            }
        });
    }, counter, lang);
    counter += 800;
}
