console.log("1) Start");

setTimeout(() => {
  console.log("4) setTimeout");
}, 0);

setImmediate(() => {
  console.log("5) setImmediate");
});

process.nextTick(() => {
  console.log("2) process.nextTick");
});

Promise.resolve().then(() => {
  console.log("3) Promise.then");
});

console.log("6) End");