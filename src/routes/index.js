// REQUIRES
const express = require('express');
const axios = require('axios');
var SpotifyWebApi = require('spotify-web-api-node');

// VARIABLES
const router = express.Router();
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL
});
  
const genres = [
  'acoustic',          'afrobeat',       'alt-rock',
  'alternative',       'ambient',        'anime',
  'black-metal',       'bluegrass',      'blues',
  'bossanova',         'brazil',         'breakbeat',
  'british',           'cantopop',       'chicago-house',
  'children',          'chill',          'classical',
  'club',              'comedy',         'country',
  'dance',             'dancehall',      'death-metal',
  'deep-house',        'detroit-techno', 'disco',
  'disney',            'drum-and-bass',  'dub',
  'dubstep',           'edm',            'electro',
  'electronic',        'emo',            'folk',
  'forro',             'french',         'funk',
  'garage',            'german',         'gospel',
  'goth',              'grindcore',      'groove',
  'grunge',            'guitar',         'happy',
  'hard-rock',         'hardcore',       'hardstyle',
  'heavy-metal',       'hip-hop',        'holidays',
  'honky-tonk',        'house',          'idm',
  'indian',            'indie',          'indie-pop',
  'industrial',        'iranian',        'j-dance',
  'j-idol',            'j-pop',          'j-rock',
  'jazz',              'k-pop',          'kids',
  'latin',             'latino',         'malay',
  'mandopop',          'metal',          'metal-misc',
  'metalcore',         'minimal-techno', 'movies',
  'mpb',               'new-age',        'new-release',
  'opera',             'pagode',         'party',
  'philippines-opm',   'piano',          'pop',
  'pop-film',          'post-dubstep',   'power-pop',
  'progressive-house', 'psych-rock',     'punk',
  'punk-rock',         'r-n-b',          'rainy-day',
  'reggae',            'reggaeton',      'road-trip',
  'rock',              'rock-n-roll',    'rockabilly',
  'romance',           'sad',            'salsa',
  'samba',             'sertanejo',      'show-tunes',
  'singer-songwriter', 'ska',            'sleep',
  'songwriter',        'soul',           'soundtracks',
  'spanish',           'study',          'summer',
  'swedish',           'synth-pop',      'tango',
  'techno',            'trance',         'trip-hop',
  'turkish',           'work-out',       'world-music'
];

const scopes = [
  'ugc-image-upload',   // Upload a Custom Playlist Cover Image
  'user-read-email',    // Get Current User's Profile
  'playlist-read-collaborative',  // nclude collaborative playlists when requesting a user's playlists.
  'playlist-modify-public',   // 	Manage user's public playlists.
  'user-library-modify',    // 	Manage your saved content.
  'user-library-read',    // 	Read access to a user's library.
  'user-follow-modify'  // Follow Artists or Users, Unfollow Artists or Users
];
  

// GETS
// log in 
router.get('/login', (req, res) => {
  res.send(spotifyApi.createAuthorizeURL(scopes))
});

// callback
router.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  
  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  };
  
  spotifyApi.authorizationCodeGrant(code).then(data => {
    const access_token = data.body['access_token'];
    const refresh_token = data.body['refresh_token'];
    const expires_in = data.body['expires_in'];
  
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);
  
    console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);

    let date_now = new Date()
    let expiration_date = new Date(date_now.getTime() + (expires_in/2) *1000);

    let cookie_val = {
      access_token: access_token,
      refresh_token: refresh_token,
      expiration_date: expiration_date
    };

    res.cookie('token',cookie_val)
    res.redirect('http://192.168.1.37:3000/home');
  }).catch(error => {
    console.error('Error getting Tokens:', error);
    res.send(`Error getting Tokens: ${error}`);
  });
});

//  informacion del usuario
router.get('/userinfo', (req, res) => {
  spotifyApi.getMe().then( data => {
    const info = {
      Name : data.body.display_name,
      UserImg : data.body.images
    };

    res.send(info)

  });
});

// get tracks
router.get('/gettracks/:number_of_tracks', (req, res) => {
  let token = req.cookies.token.access_token
  let number_of_tracks = req.params.number_of_tracks
  get_tracs(token, number_of_tracks).then( track_list => {
    res.send(track_list)
  });
});

async function get_tracs(token, number_of_tracks){  
  let tracks = [];
  let number_of_generes = 0;
  let list_of_generes = [];

  if (number_of_tracks >= 5) {
    number_of_generes = 5
  } else {
    number_of_generes = number_of_tracks
  }
  
  // get a list of random generes
  for (let i = 0; i < number_of_generes; i++) {
    let number = Math.floor(Math.random() * (genres.length));
    list_of_generes.push(genres[number]);
  };

  // data for the request
  let url = `https://api.spotify.com/v1/recommendations?limit=${number_of_tracks}&seed_genres=${list_of_generes.join("%2C")}`;
  let Authorization = `Bearer ${token}`
  // make the request to the spotify api
  let response = await axios({
    url: url,
    method: 'get',
    headers: {'Accept': 'application/json','Content-Type': 'application/json','Authorization': Authorization}
  });

  // save the data of the songs in the "tracks" list
  response.data.tracks.forEach(element => {
    tracks.push({
      img: element.album.images[0],
      artist_name: element.artists[0].name,
      artist_url: element.artists[0].external_urls,
      song_name: element.name,
      song_url: element.external_urls.spotify,
      song_uri: element.uri
    });
  });

  return tracks
};


async function create_playlist(songs){ // songs = ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
  const d = new Date();
  let text_date = d.toLocaleDateString();

  let data = await spotifyApi.createPlaylist(`All random (${text_date})`, { 'description': 'This playlist contains 30 aleatory songs', 'public': true })

  spotifyApi.uploadCustomPlaylistCoverImage(data.body.id, img)
  spotifyApi.addTracksToPlaylist(data.body.id, songs)

  let link = data.body.external_urls.spotify
  return link
}


module.exports = router;