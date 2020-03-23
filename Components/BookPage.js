import React, { Component } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';

import * as Parser from '../utils/parser';

class BookPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			bookPage: props.bookPage,
			onBackPress: props.onBackPress
		}
	}

	render() {
		return (
			<>
				<ScrollView
					style={{
						padding: 5
					}}
				>
					<TouchableOpacity
						onPress={this.state.onBackPress}
					>
						<Icon name="arrowleft" size={30} color="grey" />
					</TouchableOpacity>
					<Text>
						{this.state.bookPage.title}
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between"
						}}
					>
						<Image
							style={{ width: 150, height: 250 }}
							source={{ uri: 'http://flibusta.is'.concat(this.state.bookPage.cover) }}
						/>
						<TouchableOpacity
							style={{
								display: "flex",
								flexDirection: "row",
								backgroundColor: "tomato",
								width: 50,
								height: 50,
								padding: 8,
							}}
							onPress={() => Parser.addToLibrary(this.state.bookPage.url)}
						>
							<Icon name="shoppingcart" size={30} color="white" />
						</TouchableOpacity>
					</View>
					<Text>
						Аннотация:
					</Text>
					<Text>
						{this.state.bookPage.description}
					</Text>
				</ScrollView>
			</>
		)
	};
};

export default BookPage;
