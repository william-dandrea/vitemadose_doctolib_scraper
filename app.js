const puppeteer = require('puppeteer');
const Discord = require("discord.js");
const configDiscord = require("./discordconfig.json");

/**
 * @author D'Andréa William
 */

/**
 * Fréquence de recherche : on regarde si il y a un rdv tout les watchEverySeconds
 * @type {number}
 */
const watchEverySeconds = 5;

/**
 * Liste des liens doctolib (voir vidéo)
 * @type {string[]}
 */
const links = [
    'https://www.doctolib.fr/hopital-public/saverne/ch-sarrebourg-centre-de-vaccination-covid/booking/availabilities?motiveKey=1re%20injection%20vaccin%20COVID-19%20%28Pfizer-BioNTech%29-5494&placeId=practice-162930&specialityId=5494',
]

/**
 * Indiquez ici ce que ous voulez faire quand vous découvrez un créneau de libre
 * @param link
 */
function actionWhenAppointment(link) {
    console.log("Rdv de disponible");
    console.log(link);
}

/**
 * Fonction qui va check si il y a un rdv de libre
 */
function verify() {

    puppeteer.launch({headless:true}).then(async browser => {

        for (const link of links) {
            const page = await browser.newPage();
            await page.emulate(puppeteer.devices['iPhone 6']);

            await page.goto(link);
            await page.click('#didomi-notice-agree-button');

            await page.waitForXPath('//*[contains(text(), "Aucune disponibilit")]', { timeout: 1000 })
                .then(() => {
                    console.log('Pas de rdv de disponible');
                })
                .catch(() => {
                    actionWhenAppointment(link);
                });

            await browser.close();
        }

    }).catch(err => {
        console.log(err.message);
    });
}

/**
 * Faire tourner le script verify toutes les watchEverySeconds secondes
 */
setInterval(verify,watchEverySeconds * 1000);

const client = new Discord.Client();

client.login(configDiscord.BOT_TOKEN);


client.on("message", function(message) {
    if(message.author.id === client.user.id) {
        return;
    }
    console.log(message);
    message.channel.send("hello");
});

/*const channel = client.channels.cache.find(channel => channel.name === "bot-covid");
console.log(channel)
channel.send("Hello world");*/