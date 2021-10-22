import * as native from 'natives';

export abstract class Screen {
    public static initialize(): void {
        Screen.fadeIn(0);
        Screen.animfxPlay('ArenaWheelPurple', 0, true);
    }

    public static animfxPlay(screen: string, duration: number, looped: boolean): void {
        native.animpostfxPlay(screen, duration, looped);
    }

    public static animfxStop(screen: string): void {
        native.animpostfxStop(screen);
    }

    public static animfxStopAll(): void {
        native.animpostfxStopAll();
    }

    public static fadeOut(duration: number): void {
        native.doScreenFadeOut(duration);
    }

    public static fadeIn(duration: number): void {
        native.doScreenFadeIn(duration);
    }
}
