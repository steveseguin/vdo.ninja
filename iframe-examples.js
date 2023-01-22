/**
 * SANDBOX EXAMPLE CONFIG
 * 
 * options: (number | boolean | string | null)[] 
 *  - OPTIONAL if using a user input; see "input" below
 *  - List of values to test (passed into "result" function)
 *  - An option button will be generated for each value in the list
 * 
 * input: object
 *  - OPTIONAL
 *  - User input for testing (eg a range slider).
 *  - Output of element onchange will be passed into RESULT function.
 * 
 * labels: string[]
 *  - OPTIONAL
 *  - List of labels for option buttons (should be same length as options list).
 *  - If no labels are provided, option buttons are labeled with their value
 * 
 * result: (value: any) => object
 *  - Function that returns a postMessage object
 *  - Based on the value produced by an option button, or a user input
 */

const IFRAME_API = {
    add: {
        options: [true],
        labels: ["Video with styles"],
        result: value => ({ 
            "target": "*", 
            "add": value, 
            "settings": { "style": "width:640px;height:360px;float:left;border:10px solid red;display:block;"} 
        })
    },
    automixer: {
        options: [true, false],
        result: value => ({ "automixer": value })
    },
    bitrate: {
        options: [-1],
        labels: ["default (-1)"],
        input: {
            title: "bitrate",
            type: "range",
            min: 0,
            max: 6000,
            value: 3000
        },
        result: value => ({ "bitrate": value, "target": "*" })
    },
    camera: {
        options: [false, true, "toggle"],
        result: value => ({ "camera": value })
    },
    changeAudioDevice: { // change text of add camera button
        options: [1,2,3,4],
        result: value => ({ "changeAudioDevice": value })
    },
    changeVideoDevice: { // change text of add camera button
        options: [1,2,3,4],
        result: value => ({ "changeVideoDevice": value })
    },
    close: {
        options: [true],
        result: value => ({ "close": value })
    },
    getDetailedState: {
        options: [true],
        result: value => ({ "getDetailedState": value }),
    },
    getDeviceList: {
        options: [true],
        result: value => ({ "getDeviceList": value }),
    },
    getLoudness: {
        options: [false, true],
        result: value => ({ "getLoudness": value }),
    },
    getStreamIDs: {
        options: [true],
        result: value => ({ "getStreamIDs": value }),
    },
    keyframe: {
        options: [true],
        result: value => ({ "keyframe": value }),
    },
    mute: {
        options: [
            true,
            false,
            "toggle" // open to a better suggestion here.
        ],
        result: value => ({ "mute": value }),
    },
    mic: {
        options: [true, false, "toggle"],
        result: value => ({ "mic": value }),
    },
    panning: {
        options: [0, 180, 90],
        input: {
            title: "panning",
            type: "range",
            min: 0,
            max: 180,
            value: 90
        },
        labels: ["Left (0)", "Right (180)", "Center (90)"],
        result: value => ({ "panning": value }),
    },
    previewWebcam: { 
        options: ["previewWebcam"], // publishScreen
        result: value => ({ "function": value }),
    },
    record: {
        options: [true, false],
        result: value => ({ "record": value }),
    },
    reload: {
        options: [true],
        result: value => ({ "reload": value }),
    },
    remove: { // target can be a stream ID or * for all.
        options: [true],
        labels: ["Target video"],
        result: value => ({ "target": "*",  "remove": value })
    },
    sendChat: {
        input: {
            type: "text",
            value: "Hello"
        },
        result: value => ({ "sendChat": value }),
    },
    sceneState: {
        options: [true, false],
        labels: ["ENABLE TALLY LIGHT (true)", "STOP TALLY LIGHT (false)"],
        result: value => ({ "sceneState": value })
    },
    style: {
        options: ["#main { zoom: 0.5;} video {float: left; margin: 0; padding: 0; } #info {display:none;}"],
        labels: ["Insert Style Sheet"],
        result: value => ({ "style": value }),
    },
    volume: {
        input: {
            title: "volume",
            type: "range",
            min: 0,
            max: 200,
            value: 100
        },
        result: value => ({ "volume": value }),
    },
    ["function: Eval"]: { 
        options: ["eval"], // publishScreen
        result: value => ({ "function": value, "value": 'alert(\"DANGERUS\")' })
    },
    ["function: Change html"]: { 
        options: ["changeHTML"], // change text of add camera button
        result: value => ({ "function": value, "target": "add_camera", "value": "NEW CAMERA TEXT" })
    }
}

const COMPANION_API = { // list available commands to console
    bitrate: {
        input: {
            title: "bitrate",
            type: "range",
            min: 0,
            max: 6000,
            value: 3000
        },
        result: value => ({ target: null, action: "bitrate", value })
    },
    camera: {
        options: [false, true, "toggle"],
        result: value => ({ target: null, action: "camera", value })
    },
    forceKeyframe: {
        options: [null],
        labels: ["Rainbow puke fix"],
        result: value => ({ target: null, action: "forceKeyframe", value }),
    },
    getDetails: {
        options: [null],
        result: value => ({ target: null, action: "getDetails", value })
    },
    group: {
        options: [1,2,3,4,5,6,7,8],
        result: value => ({ target: null, action: "group", value })
    },
    hangup: {
        options: [null],
        result: value => ({ target: null, action: "hangup", value })
    },
    mic: {
        options: [false, true, "toggle"],
        result: value => ({ target: null, action: "mic", value })
    },
    panning: {
        options: [0, 180, 90],
        input: {
            title: "panning",
            type: "range",
            min: 0,
            max: 180,
            value: 90
        },
        labels: ["Left (0)", "Right (180)", "Center (90)"],
        result: value => ({ target: null, action: "panning", value })
    },
    record: {
        options: [false, true, "toggle"],
        result: value => ({ target: null, action: "record", value })
    },
    reload: {
        options: [null],
        result: value => ({ target: null, action: "reload", value })
    },
    sendChat: {
        input: {
            type: "text",
            value: "Hello"
        },
        result: value => ({ target: null, action: "sendChat", value }),
    },
    speaker: { // "speaker" also works in the same way
        options: [false, true, "toggle"],
        result: value => ({ target: null, action: "speaker", value }),
    },
    togglehand: {
        options: [null],
        result: value => ({ target: null, action: "togglehand", value }),
    },
    togglescreenshare: {
        options: [null],
        result: value => ({ target: null, action: "togglescreenshare", value }),
    },
    volume: {
        input: {
            title: "volume",
            type: "range",
            min: 0,
            max: 200,
            value: 100
        },
        result: value => ({ target: null, "action": "volume", value }),
    },
}

function guestTargetedAPI(target) { 
    return {
        addScene: {
            options: [null,1,2,3,4,5,6,7,8],
            input: {
                type: "text",
                value: "scene321"
            },
            result: value => ({ "action": "addScene", target, value })
        },
        display: {
            options: [null],
            result: value => ({ "action": "display", target, value })
        },
        forward: {
            options: [null],
            input: {
                type: "text",
                value: "room321"
            },
            result: value => ({ "action": "forward", target, value })
        },
        forceKeyframe: {
            options: [null],
            labels: ["Rainbow puke fix"],
            result: value => ({ "action": "forceKeyframe", target, value })
        },
        hangup: {
            options: [null],
            result: value => ({ "action": "hangup", target, value })
        },
        group: {
            options: [0,1,2,3,4,5,6,7,8],
            input: {
                type: "text",
                value: "group321"
            },
            result: value => ({ "action": "group", target, value })
        },
        soloChat: {
            options: [null],
            result: value => ({ "action": "soloChat", target, value })
        },
        soloVideo: {
            options: [null],
            result: value => ({ "action": "soloVideo", target, value })
        },
        speaker: {
            options: [null],
            labels: ["Remote speaker"],
            result: value =>({ "action": "speaker", target, value })
        },
        mic: {
            options: [null],
            result: value =>({ "action": "mic", target, value })
        },
        muteScene: {
            options: [null,1,2,3,4,5,6,7,8],
            input: {
                type: "text",
                value: "scene321"
            },
            result: value => ({ "action": "muteScene", target, value })
        },
        volume: {
            input: {
                title: "volume",
                type: "range",
                min: 0,
                max: 200,
                value: 100
            },
            result: value => ({ "action": "volume", target, value }),
        },
    }
}
