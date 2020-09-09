// Copy and paste this code into OBS.Ninja's developer's console to generate new Translation files

function downloadTranslation(filename, trans={}){  // downloads the current translation to a file
	allItems.forEach(function(ele){
		trans[ele.dataset.translate] = ele.innerHTML;
	});

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
	  return;
	}
	try{
		data = JSON.parse(request.responseText);
	} catch(e){
		console.log(request.responseText);
		console.error(e);
		return false;
	}
	allItems.forEach(function(ele){
		if (ele.dataset.translate in data){
			ele.innerHTML = data[ele.dataset.translate];
		}
	});
	return [filename, data];
}

var updateList = ["en", "de", "es", "ru", "fr", "pl", "ja", "ar", "it", "nl", "pt"];  // list of languages to update. Update this if you add a new language.
var allItems = document.querySelectorAll('[data-translate]');
var defaultTrans = {};
allItems.forEach(function(ele){
	defaultTrans[ele.dataset.translate] = ele.innerHTML;
});

console.log(defaultTrans);

for (var i in updateList){
	var ln = updateList[i];
	res = updateTranslation(ln);
	if (res==false){continue;}
	if (res[0]){
		console.log(res[0]);
		downloadTranslation(res[0], res[1]);
	}
	
	allItems.forEach(function(ele){
		if (ele.dataset.translate in defaultTrans){
			ele.innerHTML = defaultTrans[ele.dataset.translate];
		}
	});
}