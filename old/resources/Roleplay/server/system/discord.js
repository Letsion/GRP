import * as discord from "discord.js";
import * as alt from "alt-server";
import * as chalk from "chalk";

const client = new discord.Client();

client.on("ready", () => {
  console.log("-----------Discord Bot ist online!-----------");
  client.channels.fetch("824274675370164294").then((channel) => {
    channel.send("------------------------------------------------------------Server wurde gestartet!------------------------------------------------------------");
  });
});

alt.on("discord:Log", (msg) => {
  const embed = new discord.MessageEmbed();
  embed.setTitle(msg[1]);
  embed.setColor(msg[0]);
  embed.setDescription(msg[2]);
  embed.setFooter("Golden Roleplay ©2020-2021");
  client.channels.fetch("824274675370164294").then((channel) => {
    channel.send(embed);
  });
});

alt.on("resourceStop", () => {
  client.channels.fetch("824274675370164294").then((channel) => {
    channel.send("------------------------------------------------------------Server wurde gestoppt!------------------------------------------------------------");
  });
});

client.login("ODI0MjczMzk5MjI3NjEzMjM0.YFs-bA.AVbP_gx9fEdhD7niHBCHK9mttnY");
