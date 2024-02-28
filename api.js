function startInteract() {
    press2talk(true)
    toggleSettings()

    return new Promise((resolve) => {

        setTimeout(() => {
            console.log('intervalo')
            resolve()
        },1000)
    })
}


function selectAudio(nameDevice) {
    document.querySelector('[name="CABLE Output (VB-Audio Virtual Cable)"]').click()
     
}

function selectVideo(nameDeviceVideo) {
    var options = document.querySelectorAll('option')

    for (var i=0; i<options.length;i++){
        var option = options[i];
        if (option['text'] === nameDeviceVideo){
            option.selected = true
        }
    }
}


async function runStart(camera){
    await startInteract();
    selectVideo(camera)
    selectAudio();
}