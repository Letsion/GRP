import alt from "alt-server";
import replaceAll from "replaceall";

let cmdHandlers = {};
let mutedPlayers = new Map();
let rangeOfChat = 20;

function invokeCmd(player, cmd, args) {
  const callback = cmdHandlers[cmd];

  if (callback) {
    callback(player, args);
  } else {
    alt.emitClient(player, "notification", 4, `Unbekannter Command: ${cmd}`, 6500);
  }
}

alt.onClient("chatmessage", async (player, msg) => {
  if (msg[0] === "/") {
    alt.log(msg);
    if (msg.startsWith("/ooc")) {
      const message = replaceAll("/ooc", "", msg);
      let playersInRange = alt.Player.all.filter((x) => Distance(player.pos, x.pos) <= rangeOfChat);

      if (playersInRange.length <= 0) return;

      let closePlayers = playersInRange.filter((x) => Distance(player.pos, x.pos) <= rangeOfChat / 2);
      let farPlayers = playersInRange.filter((x) => Distance(player.pos, x.pos) >= rangeOfChat / 2);

      closePlayers.forEach((target) => {
        alt.emitClient(target, "notification", 2, `OOC CHAT ${player.character.vorname} ${player.character.nachname}: ${message}`, 10000);
      });

      farPlayers.forEach((target) => {
        alt.emitClient(target, "notification", 2, `OOC CHAT ${player.character.vorname} ${player.character.nachname}: ${message}`, 10000);
      });
      return;
    }
    msg = msg.trim().slice(1);

    if (msg.length > 0) {
      alt.log("[chat:cmd] " + player.name + ": /" + msg);
      alt.emit("discord:Log", ["#ff8400", "Command Log", `Spieler ${player.name} : /${msg}`]);

      let args = msg.split(" ");
      let cmd = args.shift();

      invokeCmd(player, cmd, args);
    }
  } else {
  }
});

// Get the distance between two vectors.
function Distance(vector1, vector2) {
  return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2));
}

export function send(player, msg) {
  alt.emitClient(player, "notification", 2, msg, 10000);
}

export function broadcast(msg) {
  send(null, msg);
}

export function registerCmd(cmd, callback) {
  if (cmdHandlers[cmd] !== undefined) {
    alt.logError(`Failed to register command /${cmd}, already registered`);
  } else {
    cmdHandlers[cmd] = callback;
  }
}

export function mute(player) {
  mutedPlayers.set(player.name, true);
}

export function unmute(player) {
  mutedPlayers.set(player.name, false);
}

// Formatting for in-chat debug messages.
export function success(message) {
  broadcast(`{00FF00}[Success] ${message}`);
}

export function info(message) {
  broadcast(`{FFAB0F}[Info] ${message}`);
}

export function warning(message) {
  broadcast(`{FF8989}[Warning] ${message}`);
}

export function error(message) {
  broadcast(`{FF0000}[Error] ${message}`);
}

export function debug(message) {
  broadcast(`{FF00FF}[Debug] ${message}`);
}

// Used in an onConnect function to add functions to the player entity for a seperate resource.
export function setupPlayer(player) {
  player.sendMessage = (msg) => {
    send(player, msg);
  };

  player.mute = (state) => {
    if (state) {
      send(player, "{FF0000} You were muted.");
    } else {
      send(player, "{00FF00} You were unmuted.");
    }

    mutedPlayers.set(player.name, state);
  };
}

// Arbitrary events to call.
alt.on("sendChatMessage", (player, msg) => {
  send(player, msg);
});

alt.on("broadcastMessage", (msg) => {
  send(null, msg);
});

export default {
  send,
  broadcast,
  registerCmd,
  setupPlayer,
  success,
  info,
  warning,
  error,
  debug,
};
