import alt from "alt-client";
import native from "natives";

const view = new alt.WebView("http://resource/client/login/html/index.html");
let cam;


//view to the other Files
view.on("load", () => {
  alt.emit("char:view:charCreator", view);
  alt.emit("char:view:charSelect", view);
});

alt.onServer("auth:Client:start", (name, bool1, bool2, bool3) => {
  view.on("load", ()=> {
  //Game Controls
  alt.showCursor(true);
  alt.toggleGameControls(false);

  //View Events
  view.focus();
  view.emit("auth:View:start", name, bool1, bool2, bool3);
  view.on("auth:Client:supportNumber", (number) => { alt.emitServer("auth:Server:supportNumber", number);});
  view.on("auth:Client:passwordSet", (passwordSetOne, passwordSetTwo) => { alt.emitServer("auth:Server:setPassword", passwordSetOne, passwordSetTwo);});
  view.on("auth:Client:try", (password) => { alt.emitServer("auth:Server:tryOn", password); });

  //Camera
  cam = native.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", 1906.839599609375, -1204.971435546875, 513.99853515625, -0.0, 0.0, 54.9409, 90, true, 0);
  native.setCamActive(cam, true);
  native.renderScriptCams(true, false, 0, true, true, 0);

  //HUD & Screen
  native.displayRadar(false);
  native.animpostfxStopAll();
  native.animpostfxPlay("ArenaWheelPurple", 0, true);

  });
});

alt.onServer("auth:Client:bool", (name, bool1, bool2, bool3, bool4) => { view.emit("auth:View:start", name, bool1, bool2, bool3, bool4); });

alt.onServer("auth:Client:stop", () => {
  view.unfocus();
  view.destroy();
  alt.showCursor(false);
});

alt.onServer('auth:Client:status', () => {
  native.animpostfxStop("ArenaWheelPurple");
  native.animpostfxPlay("PPPurpleOut", 0, false);
});

alt.on('auth:camDestroy', () => {native.setCamActive(cam, false)});