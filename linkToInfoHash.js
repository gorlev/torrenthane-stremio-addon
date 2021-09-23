const fetch = require('node-fetch')
const parseTorrent = require('parse-torrent');



async function linkToInfoHash(link){
  try{
    const uri = encodeURI(link)
    // const responseApi = await fetch(`https://api.webmasterapi.com/v1/torrent2magnet/test-apiKey/${uri}`)     
    const responseApi = await fetch(`https://api.webmasterapi.com/v1/torrent2magnet/test-apiKey/${uri}`, {
      "headers": {
        "accept": "*/*",
        "sec-ch-ua": "\"Google Chrome\";v=\"93\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"93\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\""
      },
      "referrer": "https://www.webmasterapi.com/",
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "timout": 10000
    });     
    const responseData = await responseApi.text();
    const magnetData = JSON.parse(responseData)
    const magnetLink = magnetData.results
    const infoHash = parseTorrent(magnetLink).infoHash
  
    //console.log(infoHash)
    return infoHash;

  }  catch(e) {
    console.log("I couldn't find the infoHash",e)
  }

}
module.exports = linkToInfoHash;

