const fetch = require('node-fetch')
const parseTorrent = require('parse-torrent');



async function linkToInfoHash(link){
  try{
    const uri = encodeURI(link)
    const responseApi = await fetch(`https://api.webmasterapi.com/v1/torrent2magnet/test-apiKey/${uri}`)     
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
module.exports.linkToInfoHash = linkToInfoHash;

//linkToInfoHash("https://torrenthane.net/t/Cinayet-Susu-2019-WEBRip-1080p-138-GB.torrent")
//linkToInfoHash("https://torrenthane.net/t/Wonder-Woman-1984-2020-WEBRip-1080p-288-GB.torrent")
