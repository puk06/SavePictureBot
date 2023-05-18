const { Client, Intents } = require("discord.js");
require("dotenv").config();
const fs = require("fs");

//apikey
const discordtoken = process.env.TOKEN;

//channel Id
const channelid = process.env.CHANNELID


//discord intents
const client = new Client(
    {
        intents: Intents.ALL
    }
);

//Ready to use
client.on("ready", () =>
    {
        console.log(`Success logged in! This bot version is 1.0.0`);
        client.user.setActivity('Saving picture')
    }
);

try{
    client.on("message", async (message) =>
        {
            if(message.content.startsWith("!pic")){
                if (message.author.bot){
                return
                }else{
                    try {
                        const text = fs.readFileSync(`./Picture Folder/Picture links.txt`, 'utf-8');
                        const lines = text.split(" ");
                        const lineCount = lines.length -1;
                        const randomLineNumber = Math.floor(Math.random() * lineCount);
                        const randomLine = lines[randomLineNumber];
                        message.channel.send(randomLine);
                    }catch (e) {
                        console.error(e);
                        message.channel.send('Error');
                    }
                }
            }

            if (message.attachments.size > 0 && message.attachments.every(attachment => attachment.url.endsWith('.png') || attachment.url.endsWith('.jpg') || attachment.url.endsWith('.gif') || attachment.url.endsWith('.jpeg') || attachment.url.endsWith('.JPG')) && message.channel.id == channelid) {
                if (message.author.bot) return;
                const attachment = message.attachments.first();
                const imageURL = attachment.url;
                try {
                    fs.appendFile(`./Picture Folder/Picture links.txt`, `${imageURL} `, function (err)
                        {
                            if (err) {
                                throw err;
                            }
                        }
                    );
                    message.reply(`Picture saved!`);
                }catch(e) {
                    console.log(e);
                }
            }

            if(message.content.startsWith("https") && message.channel.id == channelid){
                if (message.author.bot){
                    return
                }else{
                    const picturelink = message.content
                    try {
                        fs.appendFile(`./Picture Folder/Picture links.txt`, `${picturelink} `, function (err)
                            {
                                if (err) {
                                    throw err;
                                }
                            }
                        );
                        message.reply(`Picture saved!`);
                    }catch(e) {
                        console.log(e);
                    }
                }
            }

            if(message.content.startsWith("!delete")){
                try{
                    if(message.content == "!delete"){
                        message.reply("How to use: !delete <link you want to delete>")
                        return
                    }

                    const wannadelete = message.content.split(" ")[1]
                    removeStringFromFile(`${wannadelete} `)
                    message.reply("Deleted!")
                }catch(e){
                    console.log(e)
                    message.reply("Error")
                }
            }

            function removeStringFromFile(stringToRemove) {
                return new Promise((resolve, reject) =>
                    {
                        fs.readFile(`./Picture Folder/Picture links.txt`, "utf8", (err, data) =>
                            {
                                if (err) reject(err);
                                else {
                                    const updatedData = data.replace(new RegExp(stringToRemove, "g"), "");
                                    fs.writeFile(`./Picture Folder/Picture links.txt`, updatedData, (err) => {
                                        if (err) reject(err);
                                        else resolve();
                                        }
                                    );
                                }
                            }
                        );
                    }
                );
            }
        }
    );
}catch(e){
    console.log(e)
}

//discord bot login
client.login(discordtoken);
