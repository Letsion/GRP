import * as alt from "alt-client";
import * as native from "natives";

let view;

alt.onServer("clothes:Server:open", () => {
  view = new alt.WebView("http://resource/client/clothes/html/index.html");
});
