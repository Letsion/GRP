import * as alt from 'alt-server';
import { adminStates } from './Uitlity';
import { MSG } from '../../../lib/Notification';
import { Notification } from './Notification';

export abstract class AdminUtility {
    public static adminState(player: alt.Player, adminRank: adminStates): boolean {
        if (!player.account) return false;
        if (player.account.adminLevel >= adminRank && player.adminMode) return true;
        else {
            Notification.extended(player, MSG.admin.title, MSG.admin.noPermissions, MSG.admin.color, 5000);
            return false;
        }
    }
}
