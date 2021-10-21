// https://stackoverflow.com/a/24032179/688352

function NamedFunction(name, args, body, scope, values) {
    if (typeof args == "string"){
        values = scope 
        scope = body
        body = args 
        args = []
    }
    if (!Array.isArray(scope) || !Array.isArray(values)) {
        if (typeof scope == "object") {
            var keys = Object.keys(scope);
            values = keys.map( function(p) { return scope[p]; } );
            scope = keys;
        } else {
            values = [];
            scope = [];
        }
    }
    return Function(scope, "function "+name+"("+args.join(", ")+") {\n"+body+"\n}\nreturn "+name+";").apply(null, values);
};

const name = "MyFunction"
const args = ["arg1", "arg2", "arg3"]
const body = "console.log(arg1); console.log(arg2); console.log(arg3)"

var func = NamedFunction(name, args, body, window);
console.log("func = "+func)
console.log("func.name = "+func.name)
console.log("func.prototype = "+func.prototype)
console.log(func.prototype)
console.log(func.constructor)
console.log(func.constructor.name)

const str = "This is a 'string'"
const num = 42
const obj = {
	this:"is",
    an:"object"
}
func(str, num, obj)