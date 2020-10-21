import testForURL from '../../../../../services/testForURL';


export function containsMedia() {
    return (this.props.url.video && testForURL(this.props.url.video)) || 
    (this.props.url.audio && testForURL(this.props.url.audio)) 
    || (this.props.url.photo && testForURL(this.props.url.photo)) ? true : false
}
export function containsFile() {
    return this.props.url.source && 
    testForURL(this.props.url.source) && 
    this.props.url.file_name ? true : false
}
export function containsAudio() {
    console.warn("contains audio", this.props.url.source)
    return this.props.url.source && 
    testForURL(this.props.url.source)  ? true : false
}