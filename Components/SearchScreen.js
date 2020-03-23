import React, { Component } from 'react';
import {
	View,
	TextInput,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { ListItem, Divider } from 'react-native-elements';
import BookPage from './BookPage';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import * as Parser from '../utils/parser';
console.disableYellowBox = true;

class SearchScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			searchResult: [],
			isBook: false,
			bookPage: {},
			book: ""
		}
	}

	render() {
		if (!this.state.isBook) {
			return (
				<>
					<View>
						<TextInput
							onChangeText={(searchQuery) => this.setState({ searchQuery })}
							value={this.state.searchQuery}
						/>
						<Divider style={{ backgroundColor: 'black' }} />
						<TouchableOpacity
							style={{
								position: "absolute",
								top: 8,
								right: 5
							}}
							onPress={() => {
								Parser.fetchSearchResult(this.state.searchQuery)
									.then((resp) => this.setState({ searchResult: resp.result }))
							}}
						>
							<Icon name="search" size={30} />
						</TouchableOpacity>
						<ScrollView>
							{
								this.state.searchResult.map((l, i) => (
									<ListItem
										key={i}
										title={l.title}
										subtitle={l.author}
										bottomDivider
										onPress={() => {
											Parser.fetchBookPage(l.url)
												.then((resp) => this.setState({ isBook: true, bookPage: resp.bookPage }))
										}}
									/>
								))
							}
						</ScrollView>
					</View>
				</>
			);
		}
		else {
			return (
				<BookPage
					bookPage={this.state.bookPage}
					onBackPress={() => {
						this.setState({
							isBook: false,
							bookPage: {}
						})
					}}
				/>
			);
		}

	};
};

export default SearchScreen;
