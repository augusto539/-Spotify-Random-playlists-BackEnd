async function create_playlist(spotifyApi,songs){ // songs = ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
    const d = new Date();
    let text_date = d.toLocaleDateString();
  
    let data = await spotifyApi.createPlaylist(`All random (${text_date})`, { 'description': 'This playlist contains 30 aleatory songs', 'public': true })
    let playlistId = data.body.id
  
    console.log(data.body)
  
    // spotifyApi.uploadCustomPlaylistCoverImage(playlistId, img)
    spotifyApi.addTracksToPlaylist(playlistId, songs)
  
    let link = data.body.external_urls.spotify
    return link
}

module.exports = { create_playlist };