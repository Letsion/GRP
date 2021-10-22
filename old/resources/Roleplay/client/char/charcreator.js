import * as alt from "alt-client";
import * as native from "natives";

let view;

alt.on("char:view:charCreator", (number) => {
  view = number;
  events();
});

alt.onServer("charCreator:open", () => {
  alt.showCursor(true);
  alt.toggleGameControls(false);
  view.focus();
  view.on("load", () => {
    view.emit("charCreator:View", true);
  });
  view.emit("charCreator:View", true);
});

function events() {
  view.on("character:Client:setNewCharacter", (first, last, sex, date) => {
    const character = {
      username: alt.Player.local.name,
      vorname: first,
      nachname: last,
      geburtstag: date,
      geschlecht: sex,
      joined: 0,
      health: 200,
      armour: 0,
      hunger: 100,
      thirst: 100,
      pos: {},
      skin: {},
      clothes: {},
      dead: {
        deadTimeout: -1,
        deadState: 0,
        deadType: "",
        inComa: 0,
        deadTime: -1,
        intervall: -1,
      },
    };
    alt.emitServer("character:Server:setNewCharacter", character);
    alt.toggleGameControls(true);
  });
}

alt.onServer("creator:fade", () => {
  native.destroyAllCams(false);
  native.doScreenFadeOut(1000);
  alt.setTimeout(() => {
    native.doScreenFadeIn(1000);
  }, 6500);
});
