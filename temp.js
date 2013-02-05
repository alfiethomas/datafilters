console.log(window.location.hash);
window.location.hash = "testClass10=range_£50-£75";
console.log(window.location.hash);
var hash = window.location.hash.replace(new RegExp("%A3", 'g'),"£")
console.log(decodeURIComponent(hash));