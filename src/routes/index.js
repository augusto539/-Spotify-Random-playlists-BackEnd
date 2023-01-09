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
  

// cover of the playlist encoded in base64
const img = "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";


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
// index
router.get('/', (req, res) => {
  if (req.cookies.token){ // look if the cookie "token" exist
    if (req.cookies.token.expiration_date) {

      let token_expiration_date = new Date(req.cookies.token.expiration_date);
      let date_now = new Date();
      if (date_now >= token_expiration_date){
        res.clearCookie('token');
        res.render('index.html', {title: ''}); // render de index page
      } else {
        res.redirect('/home');
      };
    } else {
      res.clearCookie('token');
      res.render('index.html', {title: ''}); // render de index page
    };  
  } else {
    res.render('index.html', {title: ''}); // render de index page
  }
});
// log in 
router.get('/login', (req, res) => {
  console.log("esto llega hasta aca")
  // let url = spotifyApi.createAuthorizeURL(scopes)
  // res.redirect(spotifyApi.createAuthorizeURL(scopes));
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

    
    // spotifyApi.getMe()
    
    //   .then(function(data) {
        
    //     let Name = data.body.display_name
    //     let UserImg = data.body.images
    //     console.log(Name)
    //     console.log(UserImg)

    //     res.cookie('token',cookie_val)
    //     res.redirect('http://192.168.1.34:3000/home');
    //   }, function(err) {
    //     console.log('not registered user')
    //     res.redirect('/home/not_registered_user')
    // });
    res.cookie('token',cookie_val)
    res.redirect('http://192.168.1.34:3000/home');
  }).catch(error => {
    console.error('Error getting Tokens:', error);
    res.send(`Error getting Tokens: ${error}`);
  });
});

router.get('/info', (req, res) => {
  spotifyApi.getMe().then( data => {

    const info = {
      Name : data.body.display_name,
      UserImg : data.body.images
    };

    res.send(info)

  });

});


// home (create playlist)
router.get('/home/:info', (req, res) => {
  if (req.params.info == 'crear') {
    let token = req.cookies.token.access_token
    // get tracs and create the playlist
    get_tracs(token).then( track_list => {
      create_playlist(track_list).then( link => {
        res.render('home.html', {title: '- home', status:'succes', PL_link:link});
      });
    });
  };
  if (req.params.info == 'not_registered_user') {
    res.render('home.html', {title: '- home', status:'not_registered_user', PL_link:''});
  };
});

async function get_tracs(token){  
  let tracks = [];
  
  for (let i = 0; i < 2; i++) {
    let list_of_generes = [];
    for (let i = 0; i < 5; i++) {
      let number = Math.floor(Math.random() * (genres.length));
      list_of_generes.push(genres[number]);
    };

    let url = `https://api.spotify.com/v1/recommendations?limit=15&seed_genres=${list_of_generes.join("%2C")}`;
    let Authorization = `Bearer ${token}`
    let response = await axios({
      url: url,
      method: 'get',
      headers: {'Accept': 'application/json','Content-Type': 'application/json','Authorization': Authorization}
    });
    response.data.tracks.forEach(element => {
      tracks.push(element.uri);
    });
  };
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