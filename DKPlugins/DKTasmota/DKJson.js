"use strict";

const PrettyJson = function(json) {
    let prettyJson;
    if (typeof json === 'string') {
        prettyJson = JSON.parse(json);
    }
    return JSON.stringify(prettyJson, undefined, 4);
}

const HighlightJson = function(jsonString) {
    let hightlightedJson = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return hightlightedJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
                return '<span style="color:red;">' + match + '</span>';
            } else {
                cls = 'string';
                return '<span style="color:green;">' + match + '</span>';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
            return '<span style="color:blue;">' + match + '</span>';
        } else if (/null/.test(match)) {
            cls = 'null';
            return '<span style="color:magenta;">' + match + '</span>';
        }
        return '<span style="color:darkOrange;">' + match + '</span>';
    });
}

///Takes care of circular refrences in objects
function StringifyJson(object) {
    var simpleObject = {};
    for (var prop in object) {
        if (!object.hasOwnProperty(prop)) {
            continue;
        }
        if (typeof (object[prop]) == 'object') {
            continue;
        }
        if (typeof (object[prop]) == 'function') {
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject);
    // returns cleaned up JSON
}

//search the object for a key that has a matching value
function FindObject(obj, keyName, value) {
    if(obj.length){ //array of objects
        for (let o = 0; o < obj.length; o++){
            if (keyName in obj[o]) {
                if(obj[o][keyName] === value){
                    return obj[o];
                }
            }
        }
    }
    else{ //single object
        if (keyName in obj) {
            if(obj[keyName] === value){
                return obj;
            }
        }
    }
    return false;
}
