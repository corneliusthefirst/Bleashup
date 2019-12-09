 const testForURL =  function testForURL(url) {
    let test = url.includes("http://")
    let test2 = url.includes("https://")
    let test3 = url.includes('file:///');
    return test || test2 || test3
}

export default testForURL