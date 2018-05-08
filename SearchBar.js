import React, { Component } from 'react';
import './SearchBar.css';


class SearchBar extends Component {
	constructor(props){
		super(props);
		this.state={
			term: ''
		};
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
		this.checkKeyPress = this.checkKeyPress.bind(this);
	}
	
	checkKeyPress(event){
		if(event.key == 'Enter'){
			this.search();
		}
	}
	
	search(){
		if(this.state.term){
			this.props.onSearch(this.state.term);
		}
	}
	
	handleTermChange(event){
		this.setState({term: event.target.value});
	}
	
	render(){
		return (
		<div className="SearchBar">
		  <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} onKeyPress={this.checkKeyPress}/>
		  <a onClick={this.search}>SEARCH</a>
		</div>
		);
	}
}

export default SearchBar;