// Copy and paste this code into OBS.Ninja's developer's console to generate new Translation files

function downloadTranslation(filename, trans={}){  // downloads the current translation to a file
	
	var textDoc = JSON.stringify(trans, null, 2);

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/html,' + encodeURIComponent(textDoc);
	hiddenElement.target = '_blank';
	hiddenElement.download = filename+".json";
	hiddenElement.click();
	return trans;
}


function updateTranslation(filename){  // updates the website with a specific translation
	var request = new XMLHttpRequest();
	request.open('GET', "./translations/"+filename+'.json?'+(Math.random()*100).toString(), false);  // `false` makes the request synchronous
	request.send(null);

	if (request.status !== 200) {
	  return false, {};
	}
	try{
		var data = JSON.parse(request.responseText);
	} catch(e){
		console.log(request.responseText);
		console.error(e);
		return false, {};
	}
	
	var oldTransItems = data.innerHTML;  
	var allItems1 = document.querySelectorAll('[data-translate]');
	allItems1.forEach(function(ele){
		if (ele.dataset.translate in oldTransItems){
			ele.innerHTML = oldTransItems[ele.dataset.translate];
		}
	});
	var oldTransTitles = data.titles;
	var allTitles1 = document.querySelectorAll('[title]');
	allTitles1.forEach(function(ele){
		var key = ele.title.replace(/[\W]+/g,"-").toLowerCase();
		if (key in oldTransTitles){
			ele.title = oldTransTitles[key];
		}
	});
	
	var oldTransPlaceholders = data.placeholders; 
	var allPlaceholders1 = document.querySelectorAll('[placeholder]');
	allPlaceholders1.forEach(function(ele){
		var key = ele.placeholder.replace(/[\W]+/g,"-").toLowerCase();
		if (key in oldTransPlaceholders){
			ele.placeholder = oldTransPlaceholders[key];
		}
	});
	
	return [true, data];
}

var updateList = ["cs","de", "en", "es", "fr", "it", "ja", "nl", "pig", "pt", "ru", "tr", "blank" ];  // list of languages to update. Update this if you add a new language.

var allItems = document.querySelectorAll('[data-translate]');
var defaultTrans = {};
allItems.forEach(function(ele){
	var key = ele.dataset.translate.replace(/[\W]+/g,"-").toLowerCase();
	defaultTrans[key] = ele.innerHTML;
});

var defaultTransTitles = {};
var allTitles = document.querySelectorAll('[title]');
allTitles.forEach(function(ele){
	defaultTransTitles[ele.title] = ele.title;
});

var defaultTransPlaceholders = {};
var allPlaceholders = document.querySelectorAll('[placeholder]');
allPlaceholders.forEach(function(ele){
	defaultTransPlaceholders[ele.placeholder] = ele.placeholder;
});

var combinedTrans = {}
combinedTrans.titles = defaultTransTitles;
combinedTrans.innerHTML = defaultTrans;
combinedTrans.placeholders = defaultTransPlaceholders;
var counter=0;
for (var i in updateList){
	var lang = updateList[i];
	setTimeout(function(ln){
		var suceess = updateTranslation(ln); // we don't need to worry about DATA.
		if (suceess[0]==true){
			var newTrans = suceess[1].innerHTML;
			var allItems = document.querySelectorAll('[data-translate]');
			allItems.forEach(function(ele){
				var key = ele.dataset.translate;
				newTrans[key] = ele.innerHTML;
			});
			
			var newTransTitles = suceess[1].titles;
			var allTitles = document.querySelectorAll('[title]');
			allTitles.forEach(function(ele){
				var key = ele.title.replace(/[\W]+/g,"-").toLowerCase();
				newTransTitles[key] = ele.title;
			});
			
			var newPlaceholders = suceess[1].placeholders;
			var allPlaceholders = document.querySelectorAll('[placeholder]');
			allPlaceholders.forEach(function(ele){
				var key = ele.placeholder.replace(/[\W]+/g,"-").toLowerCase();
				newPlaceholders[key] = ele.placeholder;
			});
			
			////// DOWNLOAD UPDATED TRANSLATION
			var outputTrans = {}
			outputTrans.titles = newTransTitles;
			outputTrans.innerHTML = newTrans;
			outputTrans.placeholders = newPlaceholders;
			downloadTranslation(ln, outputTrans);
		} 
		  ////////// RESET THING BACK
		allItems.forEach(function(ele){
			if (ele.dataset.translate in defaultTrans){
				ele.innerHTML = defaultTrans[ele.dataset.translate];
			}
		});
		allTitles.forEach(function(ele){
			var key = ele.title.replace(/[\W]+/g,"-").toLowerCase();
			if (key in defaultTransTitles){
				ele.title = defaultTransTitles[key];
			}
		});
		allPlaceholders.forEach(function(ele){
			var key = ele.placeholder.replace(/[\W]+/g,"-").toLowerCase();
			if (key in defaultTransPlaceholders){
				ele.placeholder = defaultTransPlaceholders[key];
			}
		});
	},counter,lang);
	counter+=300;
}