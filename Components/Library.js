import React, { Component } from 'react';
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Image
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Reader from './Reader';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import * as Parser from '../utils/parser';
console.disableYellowBox = true;

class Library extends Component {
	constructor(props) {
		super(props)
		this.props.navigation.addListener('focus', () => {
			this.openLibrary()
		})
		this.state = {
			loaded: false,
			books: [],
			isBook: false,
			path: ""
		}
	}

	componentDidMount() {
		this.openLibrary()
	}

	openLibrary() {
		Parser.openLibrary()
			.then((result) => {
				this.setState({
					books: result,
					loaded: true,
				})
			})
	}

	removeBook(path) {
		this.setState({ loaded: false })

		Parser.removeBook(path)
			.then(
				Parser.openLibrary().then((result) => {
					this.setState({
						books: result,
						loaded: true,
					})
				})
			)

	}

	render() {
		if (this.state.loaded) {
			if (!this.state.isBook) {
				return (
					<>
						<ScrollView>
							{
								this.state.books.map((l, i) => (
									<ListItem
										key={i}
										leftAvatar={{ source: { uri: 'file:' + l.cover }, rounded: false }}
										title={
											<View>
												<Text>{l.name.replace('(fb2)', '').replace('.txt', '')}</Text>
												<TouchableOpacity
													style={{ position: "absolute", right: 5 }}
													onPress={this.removeBook.bind(this, l.path)}
												>
													<Icon name="trash-can" size={30} />
												</TouchableOpacity>
											</View>
										}
										bottomDivider
										onPress={() => {
											this.setState({ isBook: true, path: l.path })
										}}
									/>
								))
							}
						</ScrollView>
					</>
				)
			}
			else {
				return (
					<Reader
						path={this.state.path}
						onBackPress={() => {
							this.setState({
								isBook: false,
								path: ""
							})
						}}
					/>
				)
			}
		}
		else {
			return (
				<>
					<Image source={require('../loading.gif')} style={{ top: "40%", left: "38%", height: 100, width: 100 }} />
				</>
			)
		}
	};
};

export default Library;