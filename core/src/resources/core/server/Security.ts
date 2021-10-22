import * as alt from 'alt-server';
import { Discord } from './Discord';
import { MSG } from 'lib/Notification';
import { stringf } from './Uitlity';

export class Security {
    public static initialize(): void {
        alt.onClient((event, player) => {
            if (player.antiCheat) {
                player.antiCheat.events += 1;
                if (player.antiCheat.events === 20 && !player.adminMode) {
                    player.kick(MSG.system.spamKick);
                    Discord.log(MSG.admin.title, stringf(MSG.system.discord.spamKick, player.account?.username ?? 'Unbekannt', event), MSG.admin.color);
                }
            } else {
                player.antiCheat = {
                    events: 1,
                };
            }
        });
    }
}
