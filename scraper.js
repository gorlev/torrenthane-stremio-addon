const parseTorrent = require('parse-torrent');
const axios = require('axios').default;
//const torrentToMagnet = require('torrent-to-magnet');
const fetch = require("node-fetch");
const cheerio = require('cheerio');
const {linkToInfoHash} = require('./linkToInfoHash')

async function torrenthaneScraper(imdbId,type,season,episode) {
    try {
        //TAKES IMDB ID AND FINDS ITS NAME ON IMDB.COM
        const responseFromIMDB = await fetch(`https://v2.sg.media-imdb.com/suggestion/t/${imdbId}.json`, {
            "referrer": "https://www.imdb.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors"
        });
        const IMDBdata = await responseFromIMDB.json();
        const imdbName = await IMDBdata.d[0]["l"];
        //const IMDByear = await IMDBdata.d[0]["y"];
        //console.log(imdbName)

        //EDITS THE NAME FOR SEARCHING ON TORRENTHANE.NET
        const editedName = imdbName.toLowerCase().replaceAll(" ", "-").replaceAll("'","").replaceAll(":","")
        //console.log(editedName)

        let elements = []
        let elementsLast = []
        let stremioElements =[]

        //SEARCHS IT ON TORRENTHANE.NET
        let pageHtml = await axios.get(`https://torrenthane.net/${editedName}`).catch(function (error) {
            if (error.response.status === 404) {
              console.log("There is no torrent in that name in this website.");
            }});
        
        $ = cheerio.load(pageHtml.data);

        //SCRAPES THE DATA
        $('.filmicerik > p > strong').each((i, section) => {
            let torrentUrl = $(section).children('a').attr('href');
            let torrentName = $(section).children('a').text().trim();
            let resolution = torrentName.split(" ").pop().replace("[","").replace("]","");
            
            let size = $(section).parent().first().text().split("–").slice(0, -1).join("").trim()

            if (torrentName.includes("[")){
                    elements.push({ torrentName : torrentName,
                                    resolution : resolution,
                                    torrentUrl : torrentUrl,
                                    size : size})
                }
        }).get()

        //console.log(elements)

        //FINDING THE INFOHASH AND THE OTHER NECESSARY PARAMETERS
        for(let i = 0; i < elements.length; i++) {
            let infohash = await linkToInfoHash(encodeURI(elements[i].torrentUrl))
            elementsLast.push({infoHash: infohash, info:elements[i]})
        }
        //console.log(elementsLast)

        //USE THEM AND SEND THEM TO STREMIO
        for(i = 0; i < elements.length; i++){

            if (type ==="movie"){

                stremioElements.push({  name: `TorrentHane\n[${elementsLast[i].info.resolution}]`,
                title: `${imdbName}\n${elementsLast[i].info.torrentName}\n${elementsLast[i].info.size}`,
                infoHash: `${elementsLast[i].infoHash}`
            })
            }   else if (type === "series") {

                if(elementsLast[i].info.torrentName.includes(season + ".")) {
                    
                    stremioElements.push({  name: `TorrentHane\n[${elementsLast[i].info.resolution}]`,
                    title: `${imdbName}\n${elementsLast[i].info.torrentName}\n${elementsLast[i].info.size}`,
                    infoHash: elementsLast[i].infoHash,
                    fileIdx: episode-1
                })}
            }
        }

        //console.log(stremioElements)

        return stremioElements;


    } catch (e) {
        console.log(e)
    }
}
//torrenthaneScraper("tt7126948","movie") // wonder woman 1984
//torrenthaneScraper("tt10919380","movie") // freaky
//torrenthaneScraper("tt7767422","series",2,1) // sex education
//torrenthaneScraper("tt7671598","series",1,2) //messiah

//torrenthaneScraper("tt4225622","movie") //the baby sitter


module.exports= torrenthaneScraper