//https://stackoverflow.com/a/24032179/688352

function renameFunction(func, name) {
  	const oldName = func.name;
  	let funcString = func.toString();
 	funcString = funcString.replace("function(","function "+name+"(")
  	funcString = funcString.replace("function (","function "+name+"(")
  	funcString = funcString.replace("function "+oldName+"(","function "+name+"(")
  	funcString += "\nreturn "+name+";"
    const parent = window;
  	let scope = parent;
    let values = [];
    if (!Array.isArray(scope) || !Array.isArray(values)) {
        if (typeof scope == "object") {
            var keys = Object.keys(scope);
            values = keys.map( function(p) { return scope[p]; } );
            scope = keys;
        } else
            scope = [];
    }
 	parent[name] = Function(scope, funcString).apply(null, values)
  	return parent[name]
}

const oldName = function (arg1){
 	 console.log(arg1);
}

renameFunction(oldName, "MyNewFunc")

MyNewFunc("The function is now renamed")