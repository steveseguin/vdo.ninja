// Copy and paste this code into OBS.Ninja's developer's console to generate new Translation files

function downloadTranslation(filename, trans={}){  // downloads the current translation to a file
	document.querySelectorAll('[data-translate]').forEach(function(ele){
		trans[ele.dataset.translate] = ele.innerHTML;
	});

	var textDoc = JSON.stringify(trans, null, 2);

	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:text/html,' + encodeURIComponent(textDoc);
	hiddenElement.target = '_blank';
	hiddenElement.download = filename+".json";
	hiddenElement.click();
}


function updateTranslation(filename){  // updates the website with a specific translation
	return fetch("./translations/"+filename+'.json').then(function(response){
		if (response.status !== 200) {
			log('Looks like there was a problem. Status Code: ' +
			response.status);
			return false;
		}
		return response.json().then(function(data) {
			document.querySelectorAll('[data-translate]').forEach(function(ele){
				if (ele.dataset.translate in data){
					ele.innerHTML = data[ele.dataset.translate];
				}
			});
			try{
				getById("mainmenu").style.opacity = 1;;
			} catch(e){}
			return [filename, data];
		}).catch(function(err){
			errorlog(err);
			try{
				getById("mainmenu").style.opacity = 1;
			} catch(e){}
			return false;
		});
	});
}

var updateList = ["en", "de", "es", "ru", "fr", "pl", "ar", "it", "nl", "pt", "zh", "ja", "blank", "pig"];  // list of languages to update. Update this if you add a new language.

downloadTranslation("default");

for (var i in updateList){
	var ln = updateList[i];
	updateTranslation(ln).then(function(res){
		if (res[0]){
			console.log(res[0]);
			downloadTranslation(res[0], res[1]);
		}
	}); 
}