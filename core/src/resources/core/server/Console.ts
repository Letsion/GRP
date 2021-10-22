import * as alt from 'alt-server';
import { Events } from 'lib/events';
import { Player } from './Player';
import { Vehicle } from './Vehicle';
import { Weather } from './Weather';
import { Time } from './Time';
import { Notification } from './Notification';
import { Discord } from './Discord';
import { MSG } from 'lib/Notification';
import { adminStates, replaceAll, stringf } from './Uitlity';
import { AdminUtility } from './AdminUtility';
import { Database } from './Database';

export abstract class Console {
    public static initialize(): void {
        alt.onClient(Events.console.revive, (player: alt.Player, name: string | undefined) => {
            const p = name ? player : player;
            if (!AdminUtility.adminState(player, adminStates.SuperAdministrator) || !player.account || !p.account) return;
            Notification.extended(player, MSG.admin.title, stringf(MSG.admin.revive, p.account.username), MSG.admin.color, 10000);
            Notification.extended(p, MSG.admin.title, MSG.admin.user.revive, MSG.admin.color, 15000);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.revive, p.account.username, player.account.username), MSG.admin.color);
            Player.revive(p);
        });

        alt.onClient(Events.console.vehicle, (player: alt.Player, vehicle: string) => {
            if (!AdminUtility.adminState(player, adminStates.Developer) || !player.account) return;
            const veh = Vehicle.create(vehicle, [player.pos.x, player.pos.y, player.pos.z], [0, 0, 0]);
            veh.customPrimaryColor = new alt.RGBA(88, 1, 52, 1);
            veh.customSecondaryColor = new alt.RGBA(144, 5, 14, 1);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.addVehicle, player.account.username, vehicle), MSG.admin.color);
            Notification.simple(player, stringf(MSG.admin.addVehicle, vehicle), MSG.admin.color, 5000);
            alt.emitClient(player, Events.vehicle.enter, veh);
        });

        alt.onClient(Events.console.weather, (player: alt.Player, weather: string) => {
            if (!AdminUtility.adminState(player, adminStates.SuperAdministrator) || !player.account) return;
            Weather.setWeather(weather, false);
            Notification.extended(player, MSG.admin.title, stringf(MSG.admin.weather, weather), MSG.admin.color, 15000);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.weather, player.account.username, weather), MSG.admin.color);
        });

        alt.onClient(Events.console.time, (player: alt.Player, hour: string, minute = '0') => {
            if (!AdminUtility.adminState(player, adminStates.SuperAdministrator) || !player.account) return;
            if (hour === undefined) {
                Time.setRealtime(false);
                Notification.extended(player, MSG.admin.title, MSG.admin.realTime, MSG.admin.color, 15000);
                Discord.log(MSG.admin.title, stringf(MSG.admin.discord.realTime, player.account.username), MSG.admin.color);
            } else {
                const time = new Date();
                time.setHours(parseInt(hour), parseInt(minute));
                if (!isNaN(time.getTime())) Time.setTime(time, false);
                Notification.extended(
                    player,
                    MSG.admin.title,
                    stringf(MSG.admin.time, String(time.getHours()), String(time.getMinutes())),
                    MSG.admin.color,
                    15000
                );
                Discord.log(
                    MSG.admin.title,
                    stringf(MSG.admin.discord.time, player.account.username, String(time.getHours()), String(time.getMinutes())),
                    MSG.admin.color
                );
            }
        });

        alt.onClient(Events.console.pos, (player: alt.Player, x: number, y: number, z: number) => {
            if (!AdminUtility.adminState(player, adminStates.Developer) || !player.account) return;
            player.pos = new alt.Vector3(x, y, z);
            Notification.simple(player, stringf(MSG.admin.tp, String(x), String(y), String(z)), MSG.admin.color, 15000);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.tp, player.account.username, String(x), String(y), String(z)), MSG.admin.color);
        });

        alt.onClient(Events.console.getPos, (player: alt.Player) => {
            alt.log(player.pos);
        });

        alt.onClient(Events.console.weapon, (player: alt.Player, weapon: string) => {
            if (!AdminUtility.adminState(player, adminStates.SuperAdministrator) || !player.account) return;
            player.giveWeapon(alt.hash(weapon), 10000, true);
            Notification.simple(player, stringf(MSG.admin.weapon, weapon), MSG.admin.color, 15000);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.weapon, player.account.username, weapon), MSG.admin.color);
        });

        alt.onClient('test', (player, wheel: number) => {
            if (player.vehicle) {
                player.vehicle.setWheelDetached(wheel, true);
            }
        });

        alt.onClient(Events.console.dv, async (player: alt.Player, radius: number) => {
            if (!AdminUtility.adminState(player, adminStates.Developer) || !player.account) return;
            let radio: number = radius;
            if (!radius || radius > 10) radio = 10;
            const vehicle = !player.vehicle ? await Vehicle.getNearestVehicle(player.pos, radio) : player.vehicle;
            if (!vehicle) return;
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.deleteVehicle, player.account.username, String(vehicle.model)), MSG.admin.color);
            Notification.simple(player, stringf(MSG.admin.deleteVehicle, String(vehicle.model)), MSG.admin.color, 5000);
            vehicle.destroy();
        });

        alt.onClient(Events.console.noclip, (player: alt.Player) => {
            if (!AdminUtility.adminState(player, adminStates.Supporter) || !player.account) return;
            player.visible = !player.visible;
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.noclip, player.account.username), MSG.admin.color);
            Notification.simple(player, MSG.admin.noclip, MSG.admin.color, 5000);
            alt.emitClient(player, Events.player.noclip);
        });

        alt.onClient(Events.console.ad, (player: alt.Player) => {
            if (!player.account || player.account.adminLevel < adminStates.Supporter) return;
            player.adminMode = !player.adminMode;
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.aduty, player.account.username), MSG.admin.color);
            Notification.simple(player, MSG.admin.aduty, MSG.admin.color, 5000);
            alt.emitClient(player, Events.adminUtility.nameTag);
        });

        alt.onClient(Events.console.blips, (player) => {
            if (!AdminUtility.adminState(player, adminStates.Supporter) || !player.account) return;
            alt.emitClient(player, Events.adminUtility.blips);
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.blips, player.account.username), MSG.admin.color);
            Notification.simple(player, MSG.admin.blips, MSG.admin.color, 5000);
        });

        alt.onClient(Events.console.repair, async (player: alt.Player) => {
            if (!AdminUtility.adminState(player, adminStates.Developer) || !player.account) return;
            const vehicle = !player.vehicle ? await Vehicle.getNearestVehicle(player.pos, 10) : player.vehicle;
            if (!vehicle) return;
            const engine = vehicle.engineOn;
            vehicle.repair();
            vehicle.engineOn = engine;
            Discord.log(MSG.admin.title, stringf(MSG.admin.discord.repair, player.account.username, vehicle.model.toString()), MSG.admin.color);
            Notification.simple(player, stringf(MSG.admin.repair, vehicle.model.toString()), MSG.admin.color, 5000);
        });

        alt.onClient(Events.console.report, async (player: alt.Player, args: string[]) => {
            if (!player.account) return;
            const Players: string[] = [];
            const text = replaceAll(',', ' ', args.toString());
            alt.Player.all.forEach((p) => {
                if (!p.account) return;
                if (player.pos.distanceTo(p.pos) <= 50) {
                    Players.push(p.account.username);
                }
            });
            await Database.ticket.insertOne({
                username: player.account.username,
                players: Players,
                msg: text,
                Date: Time.getTimeMark(),
                open: true,
                admins: [],
            });
        });
    }
}
