import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			searchResults: [/*{name: "It's All Coming Back To Me Now", artist: 'Celine Dion', album: 'Falling Into You', id: '1', uri: 'idk'}, 
									{name: 'Early Morning', artist: 'a-ha', album: 'East Of The Sun West Of The Moon', id: '3', uri: 'idk'}, 
									{name: 'Guitar Man', artist: 'Bread', album: 'Guitar Man', id: '2', uri: 'idk'}*/],
			playlistName: 'New Playlist',
			playlistTracks: [/*{name: "It's All Coming Back To Me Now", artist: 'Celine Dion', album: 'Falling Into You', id: '1'}, 
									{name: 'Early Morning', artist: 'a-ha', album: 'East Of The Sun West Of The Moon', id: '3'}, 
									{name: 'Guitar Man', artist: 'Bread', album: 'Guitar Man', id: '2', uri: 'idk'}*/]
		};
		
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}
	
	addTrack(track){
		if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
			return;
		}else{
			let newPlaylist = this.state.playlistTracks.concat([track]);
			this.setState({playlistTracks: newPlaylist}); 
		}
	}
	
	removeTrack(track){
		if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)){
			let playlistIndex = this.state.playlistTracks.findIndex(trackIndex => {return trackIndex.id === track.id});
			this.state.playlistTracks.splice(playlistIndex, 1);
			this.setState({playlistTracks: this.state.playlistTracks});
		}else{
			return;
		}
	}
	
	updatePlaylistName(name){
		this.setState({playlistName: name});
	}
	
	savePlaylist(){
		let trackURIs = [];
		this.state.playlistTracks.map(uriIndex => {trackURIs.push(uriIndex.uri)});
		//alert(trackURIs);
		Spotify.savePlaylist(this.state.playlistName, trackURIs);
		this.setState({playlistName: 'New Playlist'});
		this.setState({playlistTracks: []});
	}
	
	search(searchTerm){
		//console.log(searchTerm);
		Spotify.search(searchTerm).then(tracks => {
			this.setState({searchResults: tracks});
		})
	}
	
	render() {
		return (
			<div>
			  <h1>Ja<span className="highlight">mmm</span>ing</h1>
			  <div className="App">
				<SearchBar onSearch={this.search} />
				<div className="App-playlist">
				  <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
				  <Playlist 
					playlistName={this.state.playlistName} 
					playlistTracks={this.state.playlistTracks} 
					onRemove={this.removeTrack} 
					onNameChange={this.updatePlaylistName} 
					onSave = {this.savePlaylist}
				  />
				</div>
			  </div>
			</div>
		);
	}
}

export default App;