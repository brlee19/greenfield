
const mapReactObj = (reactObj) => { //preferences obj from React
	// console.log('DEBUGGING: REACT OBJ IS', JSON.stringify(reactObj));
	let googleArr = [];
	for (var type in reactObj) {
		if (reactObj[type] === true || reactObj[type] === 'any') {
			console.log('el is', type, reactObj[type]);
			googleArr.push({
				type: type
			})
		} else if (reactObj[type].length) {
			googleArr.push({
				type: type,
				query: reactObj[type]
			})
		}
	}
	return googleArr;
}

exports.mapReactObj = mapReactObj;