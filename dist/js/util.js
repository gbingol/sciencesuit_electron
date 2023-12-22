
fetchText = function(url)
{
	let content = fetch(url).
	then( response=>response.text()).
	then(text=> text);

	return content;
}

export {fetchText}