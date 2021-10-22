import * as alt from "alt-client";
import * as native from "natives";

alt.onServer("command:heading", () => {
  const head = native.getEntityHeading(alt.Player.local.scriptID);
  alt.emitServer("command:Server:heading", head);
});

alt.onServer('command:rot', () => {
 let rot = native.getEntityRotation(alt.Player.local.scriptID, 5);
 alt.emitServer('command:Server:heading', rot);
});

let dist, text, intervall;

alt.onServer('animation', (dis, tex) => {
    dist = dis;
    text = tex;
    if (intervall) alt.clearEveryTick(intervall);
    intervall = alt.setInterval(() => {
        if (native.hasAnimDictLoaded(dis)) {
            alt.clearInterval(intervall);
            intervall = undefined;
            native.taskPlayAnim(alt.Player.local.scriptID, dis, tex, 2.0, 2.0, -1, 1, 0, false, false, false);
        } else native.requestAnimDict(dis);
    }, 500);
});

alt.onServer('stopAnim', () => {
    if (intervall) {
        alt.clearEveryTick(intervall);
        intervall = undefined;
    }
    native.stopAnimTask(alt.Player.local.scriptID, dist, text, 0);
});
