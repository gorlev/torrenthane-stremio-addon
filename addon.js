const { addonBuilder } = require("stremio-addon-sdk")
const torrenthaneScraper = require("./scraper")

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
	"id": "community.TorrentHane",
	"version": "0.0.1",
	"catalogs": [],
	"resources": [
		"stream"
	],
	"types": [
		"movie",
		"series"
	],
	"name": "TorrentHane",
	"description": "TorrentHane Addon provides Turkish and International movie/series torrent streams from torrenthane.net in SD, HD, FHD or 4K.",
	"logo": "https://torrenthane.net/wp-content/uploads/torrenthaneicon.png",
	"idPrefixes": [
		"tt"
	]
}
const builder = new addonBuilder(manifest)

builder.defineStreamHandler(async ({type, id}) => {
	console.log("request for streams: "+type+" "+id)
	// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
	let seriesId =  id.split(":")[0]
	let seriesSeason = id.split(":")[1]
	let seriesEpisode = id.split(":")[2]
	
	const stream = await torrenthaneScraper(seriesId, type, seriesSeason, seriesEpisode)

	return Promise.resolve({ streams: stream })
})

module.exports = builder.getInterface()