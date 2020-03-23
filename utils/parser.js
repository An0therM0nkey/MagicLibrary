var DomParser = require('dom-parser');
var parser = new DomParser();
var RNFS = require('react-native-fs');
import RNFetchBlob from "rn-fetch-blob";

export const formatTitleAuthor = html => {
	let dom = parser.parseFromString(html, "text/html");
	let a = dom.getElementsByTagName('a')
	let title = a[0].textContent || a[0].innerHTML
	let url = a[0].getAttribute('href')
	let author = a[1].innerHTML
	return { 'title': title, 'author': author, 'url': url }
}

export const fetchSearchResult = async query => {
	let searchQuery = query.replace(" ", "+")
	const response = await fetch('http://flibusta.is/booksearch?ask='.concat(searchQuery, "&chb=on"), {
		method: 'GET'
	})
	const html = await response.text()
	let dom = parser.parseFromString(html, "text/html");
	let ul = dom.getElementsByTagName('ul')[1].innerHTML
	if (ul.includes("следующая")) {
		ul = dom.getElementsByTagName('ul')[2].innerHTML
	}
	dom = parser.parseFromString(ul, "text/html");
	let lis = dom.getElementsByTagName('li')
	lis = lis.map((value) => formatTitleAuthor(value.innerHTML))
	return { result: lis }
}

export const fetchRecommended = async () => {
	const response = await fetch('http://flibusta.is/rec?view=books&author=&adata=name&book=&bdata=name&user=&udata=name&lang=0&srcgenre=', {
		method: 'GET'
	})
	const html = await response.text()

	let dom = parser.parseFromString(html, "text/html");
	let table = dom.getElementsByTagName('tbody')[3].innerHTML
	dom = parser.parseFromString(table, "text/html");
	let elements = dom.getElementsByTagName('tr')
	elements.shift()

	elements = elements.map((value) => {
		dom = parser.parseFromString(value.innerHTML, "text/html");
		let a = dom.getElementsByTagName('a')
		let title = a[2].textContent || a[2].innerHtml
		let url = a[2].getAttribute("href")
		return { title, author: a[0].innerHTML, url }
	})

	return { result: elements }
}

export const fetchBookPage = async url => {
	const response = await fetch('http://flibusta.is'.concat(url), {
		method: 'GET'
	})
	const html = await response.text()
	let dom = parser.parseFromString(html, "text/html");
	let coverImg = dom.getElementsByTagName('img')
	let cover = coverImg[2].getAttribute("src")
	let title = dom.getElementsByClassName("title")
	title = title[0].innerHTML
	let description = dom.getElementsByTagName('p')[1].innerHTML
	let author = dom.getElementsByTagName("a")[42].innerHTML
	return {
		bookPage: {
			cover,
			title,
			description,
			url,
			author
		}
	}
}

export const addToLibrary = url => {
	fetch('http://flibusta.is'.concat(url, "/read"), {
		method: 'GET'
	}).then((response) => { return response.text() }).then((html) => {
		let dom = parser.parseFromString(html, "text/html");
		let book = dom.getElementsByClassName('book')

		let content = ""
		book.forEach(element => {
			content = content.concat(element.innerHTML)
		});

		fetchBookPage(url)
			.then((result) => {
				let bookPage = result.bookPage;

				var path = RNFS.DocumentDirectoryPath + '/books/' + bookPage.title + " " + bookPage.author + '.txt';

				RNFS.writeFile(path, content, 'utf8')
					.then((success) => {
						console.log('FILE WRITTEN!');
					})
					.catch((err) => {
						console.log(err.message);
					});
				let url = 'http://flibusta.is' + bookPage.cover
				console.log(url)
				RNFetchBlob
					.config({
						// response data will be saved to this path if it has access right.
						path: RNFS.DocumentDirectoryPath + '/images/' + bookPage.title + " " + bookPage.author + '.jpg'
					})
					.fetch('GET', url, {
						//some headers ..
					})
					.then((res) => {
						console.log('The file saved to ', res.path())
					})
			})
	})
}

const getImageSrc = path => {
	let src = path
	src = src.replace('/books/', '/images/').replace('.txt', '.jpg')
	return src
}

export const openLibrary = async () => {
	var path = RNFS.DocumentDirectoryPath + '/books/';

	const files = await RNFS.readDir(path)

	return files.map((e) => {
		return { path: e.path, name: e.name, cover: getImageSrc(e.path) }
	})
}

export const openBook = async path => {
	const file = await RNFS.readFile(path, 'utf8')

	return file
}

export const removeBook = async path => {
	RNFS.unlink(getImageSrc(path))
		.then(() => {
			console.log('IMAGE DELETED');
		})
		// `unlink` will throw an error, if the item to unlink does not exist
		.catch((err) => {
			console.log(err.message);
		});
	return RNFS.unlink(path)
		.then(() => {
			console.log('FILE DELETED');
		})
		// `unlink` will throw an error, if the item to unlink does not exist
		.catch((err) => {
			console.log(err.message);
		});
}