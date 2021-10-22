import * as alt from 'alt-server';

export abstract class SkinCreator {
    public static initialize(): void {
        alt.onClient('', (player: alt.Player) => {
            alt.log(player.pos);
        });
    }
}
