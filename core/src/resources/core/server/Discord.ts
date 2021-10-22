import * as alt from 'alt-server';
import * as discord from 'discord.js';
import { Channel, Client } from 'discord.js';

export abstract class Discord {
    private static client: Client = new discord.Client();
    private static channel: Channel;
    public static async initialize(): Promise<void> {
        await Discord.client.login('ODI0MjczMzk5MjI3NjEzMjM0.YFs-bA.AVbP_gx9fEdhD7niHBCHK9mttnY');
        Discord.channel = await Discord.client.channels.fetch('824274675370164294');
        alt.log('Discord bot started');
        Discord.channel.send('----Server wurde gestartet----');
    }

    public static log(title: string, message: string, colorHex: string): void {
        const embed = new discord.MessageEmbed().setTitle(title).setDescription(message).setColor(colorHex);
        Discord.channel.send(embed);
    }
}
