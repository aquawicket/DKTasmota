"use strict";

// The Is the original example of hor to perform class like inheritance.

function A(){
	console.log("A() constructor")
}
A.prototype.funcA = function A_funcA(){
	console.log("A_funcA()")
}
A.prototype.sharedFunc = function A_sharedFunc(){
	console.log("A_sharedFunc()")
}


function B(){
	console.log("B() constructor")
  	A.call(this)
}
B.prototype = Object.create(A.prototype)
B.prototype.constructor = B;
B.prototype.funcB = function B_funcB(){
	console.log("B_funcB()")
}
B.prototype.sharedFunc = function B_sharedFunc(){
	console.log("B_sharedFunc()")
}


const b = new B()
b.funcB()
b.sharedFunc()
b.funcA()
if(b instanceof A) 
  console.log("b instanceof A")
else 
  console.log("%cb !instanceof A", "color:red;")
if(b instanceof B) 
  console.log("b instanceof B")
else 
  console.log("%cb !instanceof B", "color:red;")





// This is an extended example the creates inheritance dynamically
// The classExtends function will take two classes and create a parent/child relationship
// Neither class is required to know about the other class. The child class constructor function
// Will be ammended with a call to the Parent as well. 

function A2(){
	console.log("A2("+arguments.length+") constructor")
	console.log(arguments[0])
}
A2.prototype.funcA2 = function A2_funcA2(){
	console.log("A2_funcA2()")
}
A2.prototype.sharedFunc = function A2_sharedFunc(){
	console.log("A2_sharedFunc()")
	console.log(arguments[0])
}


function B2(){
	console.log("B2() constructor")
}
B2.prototype.funcB2 = function B2_funcB2(){
	console.log("B2_funcB2()")
}
B2.prototype.sharedFunc = function B2_sharedFunc(){
	console.log("B2_sharedFunc()")
}


function classExtends(child_class, parent_class){
  	const child_prototype = child_class.prototype;
  	let funcString = child_class.toString()
  	var closing_bracket = funcString.lastIndexOf("}")
  	funcString = dk.insert(funcString, closing_bracket, "\tconst args = Array.prototype.slice.call(arguments);\n\t"+parent_class.name+".call(this, args);\n")
    let child = dk.StringToFunction(child_class.name, funcString)
 	child.prototype = Object.create(parent_class.prototype)
    child.prototype.constructor = child
  	Object.assign(child.prototype, child_prototype)
  	child_class = child
  	return child_class
}

classExtends(B2, A2)
console.log(B2)
console.log(B2.name)
console.log(B2.toString())
const b2 = new B2("Test")
console.log(b2)
b2.funcB2 ? b2.funcB2() : console.log("%cb2.funcB2()", "color:red;")
b2.sharedFunc ? b2.sharedFunc() : console.log("%cb2.sharedFunc()", "color:red;")
b2.funcA2 ? b2.funcA2() : console.log("%cb2.funcA2()", "color:red;")
A2.prototype.sharedFunc.call(this, b2)
if(b2 instanceof A2) 
  console.log("b2 instanceof A2")
else 
  console.log("%cb2 !instanceof A2", "color:red;")
if(b2 instanceof B2) 
  console.log("b2 instanceof B2")
else 
  console.log("%cb2 !instanceof B2", "color:red;")
