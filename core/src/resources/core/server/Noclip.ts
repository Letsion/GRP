import alt from 'alt-server';
import { Events } from 'lib/events';

export class Noclip {
    public static initialize(): void {
        alt.onClient(Events.noclip.pos, (player: alt.Player, x: number, y: number, z: number) => {
            if (!player.account) return;
            if (player.visible) return;
            player.pos = new alt.Vector3(x, y, z);
        });
    }
}
