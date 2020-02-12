const testForURL = function testForURL(url, file) {
    return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(url) 
}

export default testForURL