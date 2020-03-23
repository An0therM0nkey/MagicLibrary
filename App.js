import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Button,
	Text,
	TextInput,
	Image,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import SearchScreen from './Components/SearchScreen';
import Library from './Components/Library';
import HomeScreen from './Components/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as Parser from './utils/parser';
console.disableYellowBox = true;

const Tab = createBottomTabNavigator();

class App extends Component {
	state = {
		searchQuery: "",
		searchResult: [],
		isBook: false,
		bookPage: {},
		book: "",
		currentPage: 0
	}

	render() {
		return (
			<NavigationContainer>
				<Tab.Navigator
					screenOptions={({ route }) => ({
						tabBarIcon: ({ focused, color, size }) => {
							let iconName;

							if (route.name === 'Search') {
								iconName = "feature-search-outline"
							} else if (route.name === 'Library') {
								iconName = "library-shelves"
							} else if (route.name === 'Home') {
								iconName = "home-outline"
							}

							// You can return any component that you like here!
							return <Icon name={iconName} size={30} color={focused ? "tomato" : "grey"} />;
						},
					})}
					tabBarOptions={{
						style: { height: 55 },
						activeTintColor: 'tomato',
						inactiveTintColor: 'gray',
					}}
				>
					<Tab.Screen name="Home" component={HomeScreen} />
					<Tab.Screen name="Search" component={SearchScreen} />
					<Tab.Screen name="Library" component={Library} />
				</Tab.Navigator>
			</NavigationContainer>
		)
	};
};

export default App;
