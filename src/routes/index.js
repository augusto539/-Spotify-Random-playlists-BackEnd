// REQUIRES
const express = require('express');
const axios = require('axios');
const get_tracs = require('../functions/get_tracks')
const create_playlist = require('../functions/create_playlist');
const register_user = require('../functions/register');
var SpotifyWebApi = require('spotify-web-api-node');

// VARIABLES
const router = express.Router();
var spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URL
});

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
    res.redirect('http://192.168.1.37:3000/playlist');
  }).catch(error => {
    // res.redirect('http://192.168.1.37:3000/home');
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

  }).catch(error => {
    // res.redirect('http://192.168.1.37:3000/home');
  });
});

// get tracks
router.get('/gettracks/:number_of_tracks', (req, res) => {
  let token = req.cookies.token.access_token
  let number_of_tracks = req.params.number_of_tracks
  get_tracs.get_tracs(token, number_of_tracks).then( track_list => {
    res.send(track_list)
  });
});

// Create playlist
router.post('/create', (req, res) => {
  console.log(req.body.songs_list);
  create_playlist.create_playlist(spotifyApi,req.body.songs_list).then( () => {
    // res.send('--------------playlist creada--------------------')
    res.redirect('http://192.168.1.37:3000/home')
  })
});


// reguister
router.post('/register', (req, res) => {
  const Data = { user: req.body.user, email: req.body.email}
  console.log(req.body.user);
  console.log(req.body.email);

  register_user.register_user(Data.user,Data.email).then(
    // res.redirect('http://192.168.1.37:3000/home')
  )

});


module.exports = router;