 const testForURL =  function testForURL(url) {
    let test = url.includes("http://")
    let test2 = url.includes("https://")
    return test || test2
}

export default testForURL