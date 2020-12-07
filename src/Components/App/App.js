import React from "react";
import ReactDOM from "react-dom";
import './App.css';
import { SearchBar } from "../SearchBar/SearchBar";
import { SearchResults } from "../SearchResults/SearchResults";
import { Playlist } from "../Playlist/Playlist";

import { Spotify } from "../../util/Spotify";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
		this.state = { 
			searchResults: [],
			playlistName: "My Playlist",
			playlistTracks: []
		}
	}

	addTrack(track) {
		let tracks = this.state.playlistTracks;

		if (tracks.find(savedTrack => savedTrack.id === track.id )) {
			return;
		}

		tracks.push(track);
		this.setState( { playlistTracks: tracks } );
	}

	removeTrack(track) {
		let tracks = this.state.playlistTracks;

		tracks.splice(tracks.indexOf(track.id), 1);

		this.setState( { playlistTracks: tracks } );
	}

	updatePlaylistName(newPlaylistName) {
		this.setState({ playlistName: newPlaylistName});
	}

	savePlaylist() {
		const trackUris = this.state.playlistTracks.map(track => track.uri);

		Spotify.savePlaylist(this.state.playlistName, trackUris)
			.then(() => {
				this.setState({
					playlistName: "New Playlist",
					playlistTracks: []
				});
			});
	}

	search(searchTerm) {
		Spotify.search(searchTerm).then(searchResults => {
			this.setState({ searchResults: searchResults })
		})
	}

	render() {
		return (
		<div>
			<h1>Ja<span className="highlight">mmm</span>ing</h1>
			<div class="App">
				<SearchBar onSearch={this.search} />
				<div className="App-playlist">
					<SearchResults searchResults={this.state.searchResults} 
						onAdd={this.addTrack} />
					<Playlist playlistName={this.state.playlistName} 
						playlistTracks={this.state.playlistTracks} 
						onRemove={this.removeTrack} 
						onNameChange={this.updatePlaylistName} 
						onSave={this.savePlaylist} />
				</div>
			</div>
		</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"))
export default App;