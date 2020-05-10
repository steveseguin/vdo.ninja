function isPrime(value) {
    for(var i = 2; i < value; i++) {
        if(value % i === 0) {
            return false;
        }
    }
    return value > 1;
}
var d = new Date();
var startTime = d.getTime();
console.log(startTime);
for (var i=0;i<100000000;i++){
	isPrime(9999999999);
}
d = new Date();
console.log(d.getTime()-startTime);
console.log(d.getTime());
postMessage(d.getTime()-startTime);

