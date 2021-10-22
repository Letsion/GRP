import * as alt from 'alt-server';

export abstract class Clothes {
    public static set(player: alt.Player, component: number, drawable: number, texture: number, palette: number | undefined): void {
        player.setClothes(component, drawable, texture, palette);
    }
}
