const puppeteer = require('puppeteer');
const Discord = require("discord.js");
const configDiscord = require("./discordconfig.json");
const https = require('https');

const discordClient = new Discord.Client();
discordClient.login(configDiscord.BOT_TOKEN);

const getBotCovidChannel = async () => {
    const channel = await discordClient.channels.cache.get("842119302349455391");
    return channel;
}

//const botCovidChannel=await getBotCovidChannel();




function launchedWhenAvailableAppointment(url) {
    console.log(url);
}


function determineIfweHaveDisponibilities(urls) {

    for (let i = 0; i < urls.length; i++) {
        https.get(urls[i],(res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {

                    let json = JSON.parse(body);

                    if (json.availabilities.length !== 0) {
                        launchedWhenAvailableAppointment(urls[i]);
                    }


                } catch (error) {
                    console.error(error.message);
                };
            });
        }).on("error", (error) => {
            console.error(error.message);
        });
    }
}








let url = "https://www.doctolib.fr/booking/centre-de-vaccination-covid-19-mougins-mouans-sartoux";
https.get(url,(res) => {
    let body = "";
    res.on("data", (chunk) => {
        body += chunk;
    });
    res.on("end", () => {
        try {


            /*const channel = client.channels.cache.find(channel => channel.name === "bot-covid");
            console.log(channel)
            channel.send("Hello world");*/

            /*
            client.on("message", function(message) {
                if(message.author.id === client.user.id) {
                    return;
                }
                console.log(message);
                message.channel.send("hello");
            });

             */

            let json = JSON.parse(body);
            // do something with JSON

            let practice_id = json.data.profile.id;
            let visit_motive_ides = json.data.visit_motives.filter(motive => motive.name.includes("1re injection vaccin COVID-19")).map(elem => elem.id);
            let agendas = json.data.agendas.filter(motivid => motivid.visit_motive_ids.some(r => visit_motive_ides.includes(r))).map(elem => elem.id);


            console.log(visit_motive_ides);
            console.log(agendas);
            let agendasString = agendas.join("-");
            let curentDate = new Date();
            let date = curentDate.getFullYear() + '-0' + (curentDate.getMonth()+1) + '-' + (curentDate.getDate() + 1);
            console.log(date);

            let urls = [];

            for (let i = 0; i < visit_motive_ides.length; i++) {

                let firstUrl = "https://www.doctolib.fr/availabilities.json?" +
                    "start_date=" + date + "&" +
                    "visit_motive_ids=" + visit_motive_ides[i] + "&" +
                    "agenda_ids=" + agendasString +"&" +
                    "practice_ids=" + practice_id + "&" +
                    "telehealth=false&" +
                    "destroy_temporary=true&" +
                    "limit=5"

                urls.push(firstUrl)
            }

            determineIfweHaveDisponibilities(urls);

        } catch (error) {
            console.error(error.message);
        };
    });
}).on("error", (error) => {
    console.error(error.message);
});




function determineIfweHaveDisponibilities(urls) {

    for (let i = 0; i < urls.length; i++) {
        https.get(urls[i],(res) => {
            let body = "";
            res.on("data", (chunk) => {
                body += chunk;
            });
            res.on("end", () => {
                try {

                    let json = JSON.parse(body);

                    if (json.availabilities.length !== 0) {
                        launchedWhenAvailableAppointment(urls[i]);
                    }


                } catch (error) {
                    console.error(error.message);
                };
            });
        }).on("error", (error) => {
            console.error(error.message);
        });
    }
}


// https://www.doctolib.fr/availabilities.json?
// start_date=2021-05-12&
// visit_motive_ids=2532715&
// agenda_ids=409882-454849-454852-406976&
// practice_ids=162930&
// telehealth=false&
// destroy_temporary=true&
// limit=5

// https://www.doctolib.fr/availabilities.json?
// start_date=2021-05-12&
// visit_motive_ids=253935&
// agenda_ids=438898-446535-446593-430671-430672-446626-438853&
// practice_ids=173639&
// telehealth=false&
// destroy_temporary=true&
// limit=5


// https://www.doctolib.fr/availabilities.json?start_date=2021-05-12&visit_motive_ids=253935&agenda_ids=438898-446535-446593-430671-430672-446626-438853&practice_ids=173639&telehealth=false&destroy_temporary=true&limit=5
