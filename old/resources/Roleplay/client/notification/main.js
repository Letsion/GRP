import * as alt from "alt-client";
import * as native from "natives";

const view = new alt.WebView("http://resource/client/notification/index.html", true);
alt.onServer("notification", notification);
alt.on('notification', notification);

function notification (type, msg, time)  {
  switch (type) {
    case 1:
      view.emit("notification:View:success", msg, time);
      break;
    case 2:
      view.emit("notification:View:info", msg, time);
      break;
    case 3:
      view.emit("notification:View:warn", msg, time);
      break;
    case 4:
      view.emit("notification:View:error", msg, time);
      break;
    case 5:
      view.emit("notification:View:announce", msg, time);
      break;
    default:
      break;
  }
}