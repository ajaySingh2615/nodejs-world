const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

eventEmitter.on("greet", (username) => {
  console.log(`Hello and welcome to events in node.js ${username}`);
});

eventEmitter.once("pushnotify", () => {
  console.log("this event will be emitted only once");
});

const myListener = () => console.log("I am test listener");
eventEmitter.on("test", myListener);
eventEmitter.emit("test");
eventEmitter.removeListener("test", myListener);
eventEmitter.emit("test");

// Emit the event
// eventEmitter.emit("greet", "mike");
// eventEmitter.emit("pushnotify");
