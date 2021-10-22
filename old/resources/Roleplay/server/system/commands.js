import * as alt from "alt-server";
import * as chat from "../chat/index.js";
import replaceAll from "replaceall";

chat.registerCmd('report', (player, args) => {
  let msg = args.toString();
  let message = replaceAll(",", " ", msg);
  alt.emit('admin:Server:reporting', player, message);
  alt.emitClient(player, 'notification', 1, 'Dein Report ist eingegangen. Ein Zuständiger Administrator wird in kürze erscheinen', 10000);
});

chat.registerCmd('id', (player) => {
  alt.emitClient(player, 'notification', 1, `Deine ID: ${player.id} und dein Guid ist: ${player.account.guid}`, 10000);
});
