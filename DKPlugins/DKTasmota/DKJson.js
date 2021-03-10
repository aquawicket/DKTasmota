const PrettyJson = function(json) {
    let prettyJson;
    if (typeof json === 'string') {
        prettyJson = JSON.parse(json);
    }
    return JSON.stringify(prettyJson, undefined, 4);
}

//TODO: we can't output this to console. It doesn't handle the spans
const HighlightJson = function(jsonString) {
    //pre
    //outline: 1px solid #ccc;
    //padding: 5px;
    //margin: 5px;
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
