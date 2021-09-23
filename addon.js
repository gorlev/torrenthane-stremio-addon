const { addonBuilder } = require("stremio-addon-sdk")
const torrenthaneScraper = require("./scraper")

const manifest = {
	"id": "community.TorrentHane",
	"version": "0.0.4",
	"catalogs": [],
	"resources": ["stream"],
	"types": ["movie","series"],
	"name": "TorrentHane",
	"description": "TorrentHane Addon provides Turkish and International movie/series torrent streams from torrenthane.net with SD, HD, FHD or 4K options.",
	"logo": "https://torrenthane.net/wp-content/uploads/torrenthaneicon.png",
	"idPrefixes": ["tt"]
}
const builder = new addonBuilder(manifest)

const CACHE_MAX_AGE = 4 * 60 * 60; // 4 hours in seconds
const STALE_REVALIDATE_AGE = 4 * 60 * 60; // 4 hours
const STALE_ERROR_AGE = 7 * 24 * 60 * 60; // 7 days

builder.defineStreamHandler(async ({type, id}) => {
	let seriesId =  id.split(":")[0]
	let seriesSeason = id.split(":")[1]
	let seriesEpisode = id.split(":")[2]
	
	const stream = await torrenthaneScraper(seriesId, type, seriesSeason, seriesEpisode)

	return Promise.resolve({ streams: stream, cacheMaxAge: CACHE_MAX_AGE, staleRevalidate: STALE_REVALIDATE_AGE, staleError: STALE_ERROR_AGE })
})

module.exports = builder.getInterface()