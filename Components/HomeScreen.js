import React, { Component } from 'react';
import {
	View,
	Image,
	ScrollView,
	Text
} from 'react-native';
import { ListItem } from 'react-native-elements';
import BookPage from './BookPage';

import * as Parser from '../utils/parser';
console.disableYellowBox = true;

class HomeScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchQuery: "",
			books: [],
			isBook: false,
			bookPage: {},
			book: "",
			loaded: false
		}
	}

	componentDidMount() {
		Parser.fetchRecommended()
			.then((resp) => {
				this.setState({
					books: resp.result,
					loaded: true,
				})
			})
	}

	render() {
		if (this.state.loaded) {
			if (!this.state.isBook) {
				return (
					<>
						<View>
							<Text
								style={{
									backgroundColor: "tomato",
									color: "white",
									fontSize: 30,
									padding: 10
								}}
							>
								Recommended
							</Text>
							<ScrollView>
								{
									this.state.books.map((l, i) => (
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
		} else {
			return (
				<>
					<Image source={require('../loading.gif')} style={{ top: "40%", left: "38%", height: 100, width: 100 }} />
				</>
			)
		}

	};
};

export default HomeScreen;
