const bowser = require("bowser");

if (bowser.webkit || bowser.blink || bowser.gecko || bowser.msedge) {
  console.info("Supported browser engine detected");
} else {
  console.info("Unsupported browser engine detected");
  window.location = "/unsupported";
}
