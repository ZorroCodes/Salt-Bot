const Discord = require('discord.js');
const snekfetch = require("snekfetch");
const { version } = require('discord.js');
const client = new Discord.Client()

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

client.on("guildMemberAdd", (member) => {
  let role = member.guild.roles.find("name", "Subscriber");
  member.addRole(role)
});




client.on("ready", () => {
  client.user.setPresence({game: {name: `+Help`, type: 'WATCHING'}});
  client.user.setStatus('dnd')
  console.log(`Logged In As ${client.user.tag}, Serving For ${client.guilds.size} Guilds, ${client.channels.size} Channels, And ${client.users.size} Users!`);
});

const prefix = '+';

client.on("message", async message => {
  if (message.channel.type === "dm") return;
  if(message.author.bot) return;
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if (command === 'help') {
  const embed = new Discord.RichEmbed()
  .setColor(`050505`)
  .addField('Salt\'s Commands', 'Here Are All My Commands')
  .addField('Information', 'Ping - Measures The Bots Latency\n\nStats - Returns All Of My Statistics')
  .addField('Utility', 'Server Info - Returns The Servers Info\n\nUser Info - Returns A Users Info\n\nInvites - Checks If An User Has A Invite As Game')
  .addField('Fun', `Roll - Rolls The Dice\n\nEmojis - Returns All The Servers Emotes`)
  .addField('Animals', 'Bunny - Returns A Cute Bunny;)\n\nDog - Returns A Cute Dog;)')
  .addField('Owner', `Eval - No Description Provided`)
  .addField('Music', 'No Commands Available')
  message.channel.send({embed});
  }
  
  if (command === 'ping') {
  message.channel.send(`Pong \`${Date.now() - message.createdTimestamp}MS\``);
  }
  
  if (command === 'stats') {
  const embed = new Discord.RichEmbed()
  .addField('Salt\'s Statistics', 'Here Are All Of My Statistics')
  .addField('» Memory Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`)
  .addField('» Bot Version', `${process.env.BOT_VERSION}`)
  .addField('» Node', `${process.env.NODE}`)
  .addField('» Discord.JS', `${version}`)
  .addField('» Servers', `${client.guilds.size}`)
  .setColor(`D8EB07`)
  message.channel.send({embed});
  }
  

 if (command === 'server') {
 const info = args.join("info");
 const embed = new Discord.RichEmbed()
 .setColor(`1CE600`)
 .addField(`${message.guild.name}'s Server Info`, 'Here Is This Servers Info')
 .addField('Members', `${message.guild.members.filter(member => member.user.bot).size} Bots Of ${message.guild.memberCount} Members`)
 .addField('Channels', `${message.guild.channels.filter(chan => chan.type === 'voice').size} Voice / ${message.guild.channels.filter(chan => chan.type === 'text').size} Text`)
 .addField('Owner', `${message.guild.owner.user.tag}`)
 message.channel.send({embed});
 } 
  

 if (command === 'user') {
   
   const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible"
};
   
     const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
  if (!member) return message.reply("Please Provide A Valid Mention Or User ID");
  let bot;
  if (member.user.bot === true) {
    bot = "Yes";
  } else {
    bot = "No";
  } 
   
 const infos = args.join("info");
 const embed = new Discord.RichEmbed()
 .addField('Username', `${member.user.username}`)
 .addField('Discriminator', `${member.user.discriminator}`)
 .addField('Bot?', `${bot}`)
 .addField('Status', `${status[member.user.presence.status]}`)
 .addField('Game', `${member.user.presence.game ? `${member.user.presence.game.name}` : "Nothing"}`)
 .setThumbnail(`${member.user.displayAvatarURL}`)
 .setColor(`0x00AE86`)
 return await message.channel.send({embed}); 
 } 
  
 if (command === 'invites') {
 const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
  return message.channel.send(members.map(member => `Invites\n\`${member.id}\` ${member.displayName}`).join("\n") || "Nobody Has An Invite Set As A Game");
}; 
  
 if (command === 'roll') {
 return message.reply(`You Rolled A ${Math.floor((Math.random() * 6) + 1)}, Great Job!`);
 } 
  
if (command === 'emojis') {
  const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
  return await message.channel.send(emojiList);
}
  
 if (command === 'bunny') {
 const { body } = await snekfetch.get("https://api.bunnies.io/v2/loop/random/?media=gif,png");
 const embed = new Discord.RichEmbed()
 .setTitle('Cute Bunnys')
 .setImage(`${body.media.gif}`)
 .setColor(`RANDOM`)
 return await message.channel.send({embed});
 } 
  
if (command === 'dog') {
const url = args[0] ? `https://dog.ceo/api/breed/${args[0]}/images/random` : "https://dog.ceo/api/breeds/image/random";
const { body } = await snekfetch.get(url);  
const embed = new Discord.RichEmbed()
 .setTitle('Cute Dogs')
 .setImage(`${body.message}`)
 .setColor(`RANDOM`)
 return await message.channel.send({embed});
}
  
 if (command === 'eval') {
if(message.author.id !== process.env.OWNER) return message.reply(`You Damn Idiot, Have You Seen The Help List? This Command Is Under The 'Owner' Category Meaning It's Unable To Be Used By Other People But The Bot Owner`);
const script = message.content.substring('+eval '.length);
const result = eval(script);
return message.channel.send(result.toString());
  }
  

    
});

client.login(process.env.TOKEN)