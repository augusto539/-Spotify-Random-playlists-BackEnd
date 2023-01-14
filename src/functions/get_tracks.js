const axios = require('axios');

const genres = [
  'acoustic', 'afrobeat', 'alt-rock',
  'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues',
  'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house',
  'children', 'chill', 'classical',
  'club', 'comedy', 'country',
  'dance', 'dancehall', 'death-metal',
  'deep-house', 'detroit-techno', 'disco',
  'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro',
  'electronic', 'emo', 'folk',
  'forro', 'french', 'funk',
  'garage', 'german', 'gospel',
  'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy',
  'hard-rock', 'hardcore', 'hardstyle',
  'heavy-metal', 'hip-hop', 'holidays',
  'honky-tonk', 'house', 'idm',
  'indian', 'indie', 'indie-pop',
  'industrial', 'iranian', 'j-dance',
  'j-idol', 'j-pop', 'j-rock',
  'jazz', 'k-pop', 'kids',
  'latin', 'latino', 'malay',
  'mandopop', 'metal', 'metal-misc',
  'metalcore', 'minimal-techno', 'movies',
  'mpb', 'new-age', 'new-release',
  'opera', 'pagode', 'party',
  'philippines-opm', 'piano', 'pop',
  'pop-film', 'post-dubstep', 'power-pop',
  'progressive-house', 'psych-rock', 'punk',
  'punk-rock', 'r-n-b', 'rainy-day',
  'reggae', 'reggaeton', 'road-trip',
  'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa',
  'samba', 'sertanejo', 'show-tunes',
  'singer-songwriter', 'ska', 'sleep',
  'songwriter', 'soul', 'soundtracks',
  'spanish', 'study', 'summer',
  'swedish', 'synth-pop', 'tango',
  'techno', 'trance', 'trip-hop',
  'turkish', 'work-out', 'world-music'
];

async function get_tracs(token, number_of_tracks) {
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
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': Authorization }
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


module.exports = { get_tracs };