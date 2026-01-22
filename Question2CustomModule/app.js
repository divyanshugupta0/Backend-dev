const utils = require("./stringUtils");

const text = "Divyanshu Gupta";

console.log("Original:", text);
console.log("Capitalized:", utils.capitalize(text));
console.log("Reversed:", utils.reverseString(text));
console.log("Vowels Count:", utils.countVowels(text));
