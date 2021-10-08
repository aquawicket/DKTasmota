function A(){
	console.log("A() constructor"); 
}
A.prototype.funcA = function A_funcA(){
	console.log("A_funcA()")
}
A.prototype.sharedFunc = function A_sharedFunc(){
	console.log("A_sharedFunc()")
}
Object.defineProperty(A, Symbol.hasInstance, {
	value: function(instance) {
        while(instance !== instance.__proto__.constructor){
        	instance = instance.__proto__.constructor 
          	if(instance === A)
            	return true
        }
        return false
	}
});



function B(){
	console.log("B() constructor");
}
B.prototype.funcB = function B_funcB(){
	console.log("B_funcB()")
}
B.prototype.sharedFunc = function B_sharedFunc(){
	console.log("B_sharedFunc()")
}
Object.defineProperty(B, Symbol.hasInstance, {
	value: function(instance) {
        while(instance !== instance.__proto__.constructor){
        	instance = instance.__proto__.constructor 
          	if(instance === B)
            	return true
        }
        return false
	}
});


function C(){
	console.log("C() constructor"); 
}
C.prototype.funcC = function C_funcC(){
	console.log("C_funcC()")
}
C.prototype.sharedFunc = function C_sharedFunc(){
	console.log("C_sharedFunc()")
}
Object.defineProperty(C, Symbol.hasInstance, {
	value: function(instance) {
        while(instance !== instance.__proto__.constructor){
        	instance = instance.__proto__.constructor 
          	if(instance === C)
            	return true
        }
        return false
	}
});

/*
// EVERYTHING is correct except for the constructor
Object.setPrototypeOf(B, A.prototype)
const temp = Object.create(A)
Object.assign(temp.prototype, B.prototype)
B.prototype = temp.prototype
const b = new B()
*/

/*
// EVERYTHING is correct except, b is not and instance of A
Object.setPrototypeOf(B, A.prototype)
const b = Object.assign(new B(), A.prototype, B.prototype, A.prototype);
*/

Object.setPrototypeOf(A, A.prototype)
Object.setPrototypeOf(B, A.prototype)
Object.setPrototypeOf(C, B.prototype)
const c = Object.assign(new C(), A.prototype, B.prototype, C.prototype);

c.sharedFunc ? c.sharedFunc() : console.log("%cNO_sharedFunc()", "color:red;")
c.funcA ? c.funcA() : console.log("%cNO_funcA()", "color:red;")
c.funcB ? c.funcB() : console.log("%cNO_funcB()", "color:red;")
c.funcC ? c.funcC() : console.log("%cNO_funcC()", "color:red;")


if(A instanceof A) 
  console.log("A instanceof A")
else 
  console.log("%cA !instanceof A", "color:red;")

if(B instanceof B) 
  console.log("B instanceof B")
else 
  console.log("%cB !instanceof B", "color:red;")

if(C instanceof C) 
  console.log("C instanceof C")
else 
  console.log("%cC !instanceof C", "color:red;")

if(B instanceof A) 
  console.log("B instanceof A")
else 
  console.log("%cB !instanceof A", "color:red;")

if(C instanceof B) 
  console.log("C instanceof B")
else 
  console.log("%cC !instanceof B", "color:red;")

if(C instanceof A) 
  console.log("C instanceof A")
else 
  console.log("%cC !instanceof A", "color:red;")

if(c instanceof C) 
  console.log("c instanceof C")
else 
  console.log("%cc !instanceof C", "color:red;")

if(c instanceof B) 
  console.log("c instanceof B")
else 
  console.log("%cc !instanceof B", "color:red;")

if(c instanceof A) 
  console.log("c instanceof A")
else 
  console.log("%cc !instanceof A", "color:red;")


dk.dumpVariable(c)