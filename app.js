const Discord = require("discord.js");
const configDiscord = require("./discordconfig.json");
const centreVaccinationNice = require("./listLinksSophia.json");
const https = require('https');
const discordClient = new Discord.Client();
discordClient.login(configDiscord.BOT_TOKEN);

let botCovidChannel = null;
let linksTime = [];


const getBotCovidChannel = async () => {
    if (botCovidChannel === null) {
        botCovidChannel = await discordClient.channels.cache.get("842119302349455391");
    }
}


function availableAppointment(jsonAppointment) {
    let urlDestination = 'https://www.doctolib.fr' + jsonAppointment.search_result.url;
    const indexInLinkTime = linksTime.findIndex(linkTime => linkTime[0] === urlDestination);

    if (indexInLinkTime > -1) {
        // Si il est deja dedans
        if (Date.now() - linksTime[indexInLinkTime][1] > 10000) {
            linksTime[indexInLinkTime][1] = Date.now();
            botCovidChannel.send("⚠️ Nouveau creneau disponible ! à : " + urlDestination);
        }
    } else {

        linksTime.push([urlDestination, Date.now()]);
        botCovidChannel.send("⚠️ Nouveau creneau disponible ! à : " + urlDestination);
    }
}


function unavailableAppointment(jsonAppointment) {

    let urlDestination = 'https://www.doctolib.fr' + jsonAppointment.search_result.url;

    const indexInLinkTime = linksTime.findIndex(linkTime => linkTime[0] === urlDestination);
    if (indexInLinkTime > -1) {
        linksTime.splice(indexInLinkTime, 1);
    }
}



async function launch(url, urlDestination) {
    await getBotCovidChannel();
    https.get(url,(res) => {
        let body = "";
        res.on("data", (chunk) => {
            body += chunk;
        });
        res.on("end", () => {
            try {
                let json = JSON.parse(body);

                if (json.availabilities.length !== 0) {
                    // On a un rdv
                    availableAppointment(json);

                } else {
                    // On a pas de rdv
                    unavailableAppointment(json);
                }

            } catch (error) {
                console.error(error.message);
            };
        });
    }).on("error", (error) => {
        console.error(error.message);
    });
}



if (process.env.NODE_APP_INSTANCE === '0' || process.env.NODE_APP_INSTANCE === undefined) {
    setInterval(() => {

        centreVaccinationNice.forEach(centre => {
            launch(centre);
        });




    },5000);


}








