const testForURL = function testForURL(url, file) {
    let test = url.includes("http://")
    let test2 = url.includes("https://")
    let test3 = url.includes("event")
    return !test3 && (test || test2) 
}

export default testForURL