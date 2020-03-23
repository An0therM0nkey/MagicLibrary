import React, { Component } from 'react';
import {
	Image,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	Dimensions
} from 'react-native';

import * as Parser from '../utils/parser';

import Icon from 'react-native-vector-icons/dist/AntDesign';

const screenHeight = Dimensions.get('window').height;
const lineHeight = 20
const fontSize = 16
const step = 1200

class Reader extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loaded: false,
			book: "",
			currentPage: 0,
			y: 0,
			path: props.path,
			onBackPress: props.onBackPress
		}
	}

	componentDidMount() {
		Parser.openBook(this.state.path).then((result) => {
			this.setState({
				book: result,
				loaded: true
			})
		})
	}

	nextButtonPress() {
		let currentPage = this.state.book.length - this.state.currentPage < step ? this.state.currentPage : this.state.currentPage + step
		this.setState({ currentPage })
	}

	prevButtonPress() {
		let currentPage = this.state.currentPage == 0 ? 0 : this.state.currentPage - step
		this.setState({ currentPage })
	}

	getPageContent() {
		let start = this.state.currentPage
		let end = this.state.currentPage + step
		if (end >= this.state.book.length)
			end = this.state.book.length - 1
		let page = this.state.book.slice(start, end)
		if (this.state.book.charAt(this.state.currentPage + 1) != " ")
			page = page.concat("-");
		return page
	}

	getPageNumber() {
		const current = (this.state.currentPage / step) + 1;
		const total = Math.round(this.state.book.length / step);
		return "".concat(current, "/", total)
	}

	render() {
		if (this.state.loaded) {
			return (
				<>
					<TouchableOpacity
						onPress={this.state.onBackPress}
						style={{ top: 4 }}
					>
						<Icon name="arrowleft" size={30} color="grey" />
					</TouchableOpacity>
					<Text style={[styles.counter]}>
						{
							this.getPageNumber()
						}
					</Text>
					<View style={[styles.pageContainer]}>
						<Text style={[styles.text]}>
							{
								this.getPageContent()
							}
						</Text>
						<View style={styles.navContainer}>
							<TouchableOpacity
								activeOpacity={0.1}
								style={[styles.navButton]}
								onPress={this.prevButtonPress.bind(this)}
							></TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.1}
								style={[styles.navButton]}
								onPress={this.nextButtonPress.bind(this)}
							></TouchableOpacity>
						</View>
					</View>
				</>
			)
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

export default Reader;

const styles = StyleSheet.create({
	navContainer: {
		position: "absolute",
		display: "flex",
		flexDirection: "row",
	},
	navButton: {
		margin: 0,
		padding: 0,
		backgroundColor: "grey",
		height: screenHeight,
		width: "50%",
		opacity: 0,
	},
	text: {
		textAlign: "justify",
		lineHeight: lineHeight,
		fontSize: fontSize,
		padding: 10
	},
	pageContainer: {
		position: "relative"
	},
	counter: {
		position: "absolute",
		top: 10,
		left: "46%"
	}
});