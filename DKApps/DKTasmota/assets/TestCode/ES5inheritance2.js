// https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5

function A(){
	console.log("A() constructor"); 
}
A.prototype.funcA = function A_funcA(){
	console.log("A_funcA()")
}
A.prototype.sharedFunc = function A_sharedFunc(){
	console.log("A_sharedFunc()")
}


function B(){
	console.log("B() constructor");
  	A.call(this)
}
B.prototype = Object.create(A.prototype);
B.prototype.constructor = B;
B.prototype.funcB = function B_funcB(){
	console.log("B_funcB()")
}
B.prototype.sharedFunc = function B_sharedFunc(){
	console.log("B_sharedFunc()")
}


function C(){
	console.log("C() constructor");
  	B.call(this)
}
C.prototype = Object.create(B.prototype);
C.prototype.constructor = C;
C.prototype.funcC = function C_funcC(){
	console.log("C_funcC()")
}
C.prototype.sharedFunc = function C_sharedFunc(){
	console.log("C_sharedFunc()")
}

const c = new C()

if(c instanceof B) 
  console.log("c instanceof B")
else 
  console.log("%cc !instanceof B", "color:red;")

if(c instanceof A) 
  console.log("c instanceof A")
else 
  console.log("%cc !instanceof A", "color:red;")


dk.dumpVariable(c)