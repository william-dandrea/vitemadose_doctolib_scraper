const Discord = require("discord.js");
const configDiscord = require("./discordconfig.json");
const centreVaccinationNice = require("./centre-de-vaccination-06.json");
const https = require('https');
const discordClient = new Discord.Client();
discordClient.login(configDiscord.BOT_TOKEN);

// let urlDestination = "https://www.doctolib.fr/centre-de-sante/mougins-mouans-sartoux/centre-de-vaccination-covid-19-mougins-mouans-sartoux?highlight%5Bspeciality_ids%5D%5B%5D=5494"
// let url = "https://www.doctolib.fr/booking/centre-de-vaccination-covid-castellane";
// let url = "https://www.doctolib.fr/booking/centre-de-vaccination-covid-19-mougins-mouans-sartoux";



let botCovidChannel = null;

const getBotCovidChannel = async () => {
    if (botCovidChannel === null) {
        botCovidChannel = await discordClient.channels.cache.get("842119302349455391");
    }
}
//const botCovidChannel=await getBotCovidChannel();
function launchedWhenAvailableAppointment(urlIntern, urlDestination) {
    botCovidChannel.send("Nouveau creneau disponible ! à : " + urlDestination);
    console.log(urlDestination);
}
function launchedWhenUnavailableAppointment(urlIntern, urlDestination) {
    //botCovidChannel.send("Pas de creneau dispo a cette url : " + urlDestination)
    console.log("Pas de creneau dispo");
}
function determineIfweHaveDisponibilities(urls, urlDestination) {
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

                        launchedWhenAvailableAppointment(urls[i], urlDestination);
                    } else {
                        launchedWhenUnavailableAppointment(urls[i], urlDestination);
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
                console.log(urls);
                determineIfweHaveDisponibilities(urls, urlDestination);
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

        centreVaccinationNice.elements.forEach(centre => {
            launch(centre.url_api, centre.url_destination);
        })
    },2500);
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
