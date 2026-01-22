// stringUtils.js

function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverseString(str) {
  if (!str || typeof str !== "string") return "";
  return str.split("").reverse().join("");
}

function countVowels(str) {
  if (!str || typeof str !== "string") return 0;
  const matches = str.match(/[aeiou]/gi);
  return matches ? matches.length : 0;
}

// Export functions
module.exports = {
  capitalize,
  reverseString,
  countVowels
};
