const testForURL = function testForURL(url, file) {
    return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(url) || url &&
    url.includes("http://")|| url &&
    url.includes("https://")
}

export default testForURL