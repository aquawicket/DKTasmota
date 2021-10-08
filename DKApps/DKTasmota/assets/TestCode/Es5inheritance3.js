// https://eli.thegreenplace.net/2013/10/22/classical-inheritance-in-javascript-es5
console.log("**********************************")

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

console.log(B)
const b = new B()
console.log(b)
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







console.log("**********************************")

function A2(){
	console.log("A2() constructor")
}
A2.prototype.funcA2 = function A2_funcA2(){
	console.log("A2_funcA2()")
}
A2.prototype.sharedFunc = function A2_sharedFunc(){
	console.log("A2_sharedFunc()")
}

function B2(){
	console.log("B2() constructor");
}
B2.prototype.funcB2 = function B2_funcB2(){
	console.log("B2_funcB2()")
}
B2.prototype.sharedFunc = function B2_sharedFunc(){
	console.log("B2_sharedFunc()")
}

function ClassExtends(clss, clssB){
  	const clss_prototype = clss.prototype;
    clss = function B2(){
    	console.log(clss.name+"() constructor");
    	clssB.call(this)
    }
 	clss.prototype = Object.create(A2.prototype);
    clss.prototype.constructor = clss;
  	Object.assign(clss.prototype, clss_prototype)
  	return clss
}

B2 = ClassExtends(B2, A2)
console.log(B2)
const b2 = new B2()
console.log(b2)
b2.funcB2 ? b2.funcB2() : console.log("%cb2.funcB2()", "color:red;")
b2.sharedFunc ? b2.sharedFunc() : console.log("%cb2.sharedFunc()", "color:red;")
b2.funcA2 ? b2.funcA2() : console.log("%cb2.funcA2()", "color:red;")
if(b2 instanceof A2) 
  console.log("b2 instanceof A2")
else 
  console.log("%cb2 !instanceof A2", "color:red;")
if(b2 instanceof B2) 
  console.log("b2 instanceof B2")
else 
  console.log("%cb2 !instanceof B2", "color:red;")
