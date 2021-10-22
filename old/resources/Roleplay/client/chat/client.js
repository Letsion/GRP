import * as alt from "alt-client";

let buffer = [];
let opened = false;
let hidden = false;

let view = new alt.WebView("http://resource/client/chat/html/index.html");

alt.emit('settings:Client:viewChat', view)

function addMessage(name, text) {
  if (name) {
    view.emit("addMessage", name, text);
  } else {
    view.emit("addString", text);
  }
}

export function pushMessage(name, text) {
  if (!loaded) {
    buffer.push({ name, text });
  } else {
    addMessage(name, text);
  }
}

export function pushLine(text) {
  pushMessage(null, text);
}

export function isChatHidden() {
  return hidden;
}

export function isChatOpen() {
  return opened;
}

alt.onServer("chatmessage", pushMessage);

export default { pushMessage, pushLine, isChatHidden, isChatOpen };
