const clientID = '5e0e6c7d5a11475b918e46685b376443';
const redirectURI = 'http://localhost:3000/';
//const redirectURI = 'P_Jammm_Project.surge.sh';
let accessToken;

const Spotify = {
	getAccessToken(){
		if (accessToken){
			return accessToken;
		}else if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)){
			accessToken = window.location.href.match(/access_token=([^&]*)/)[0].slice(13);
			let expiresIn = window.location.href.match(/expires_in=([^&]*)/)[0].slice(11);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		}else{
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		}
	},
	
	search(term){
		accessToken = this.getAccessToken();
		
		return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`,
			{headers: {Authorization: `Bearer ${accessToken}`}}).then(response => {
				if(response.ok){
					return response.json();
				}else{
					throw new Error('Request failed!');
			}}, networkError => { console.log(networkError.message);
			}).then(jsonResponse => {
				if (jsonResponse.hasOwnProperty('tracks')){
					return jsonResponse.tracks.items.map(track =>(
					{	id: track.id,
						name: track.name,
						artist: track.artists[0].name,
						album: track.album.name,
						uri: track.uri
					}));
				}
			});
	},
	
	savePlaylist(name, arrayURIs){
		if(name && arrayURIs.length){
			let userAccessToken = accessToken;
			let headers = {'Authorization': 'Bearer ' + userAccessToken}
			let userId;
			
			fetch('https://api.spotify.com/v1/me', {headers: headers}).then(
				response => {
					if(response.ok){
						return response.json();
					}else{
						throw new Error('Request failed!');
				}}, networkError => { console.log(networkError.message)}).then(jsonResponse => 
					{
					userId = jsonResponse.id; 
					return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {method: 'POST', headers: {
					'Authorization': 'Bearer ' + userAccessToken, "Content-type": "application/json"}, 
					body: JSON.stringify({name: name})}).then(response => {
					if(response.ok){
						return response.json();
					}else{
						throw new Error('Request failed!');
				}}, networkError => { console.log(networkError.message);}).then(jsonResponse => 
					{ 
					let playlistID = jsonResponse.id; 
					return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {method: 'POST', headers: {
					'Authorization': 'Bearer ' + userAccessToken, "Content-type": "application/json"}, 
					body: JSON.stringify({uris: arrayURIs})}).then(response => {
					if(response.ok){
						return response.json();
					}else{
						throw new Error('Request failed!');
				}}, networkError => { console.log(networkError.message);})})
					})
		}else{
			return;
		}
	}
}

export default Spotify;