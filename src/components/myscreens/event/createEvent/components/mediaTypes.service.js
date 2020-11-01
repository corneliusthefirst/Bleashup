import testForURL from '../../../../../services/testForURL';
import GState from '../../../../../stores/globalState';
import message_types from '../../../eventChat/message_types';
import Texts from '../../../../../meta/text';


export function containsMedia(url) {
    url = (this && this.url) || url
    return (url && url.video && testForURL(url.video)) ||
        (url && url.photo && testForURL(url.photo)) ? true : false
}
export function containsVideo(url) {
    url = (this && this.url) || url
    return url && url.video && testForURL(url.video)
}
export function containsPhoto(url) {
    url = (this && this.url) || url
    return url && url.photo && testForURL(url.photo)
}
export function containsFile(url) {
    url = (this && this.url) || url
    return url && url.source &&
        !GState.isUndefined(url.source) &&
        url.file_name && !GState.isUndefined(url.file_name)
        ? true : false
}
export function containsAudio(url) {
    url = (this && this.url) || url
    return url && url.source && !GState.isUndefined(url.source) ? true : false
}
export function calculateType(url) {
    if ((this && this.containsAudio && this.containsAudio(url)) || 
    containsAudio(url)) {
        return message_types.audio
    } else if ((this && this.containsFile && this.containsFile(url)) || 
    containsFile(url)) {
        return message_types.file
    } else if ((this && this.containsMedia &&  this.containsMedia(url)) || 
    containsMedia(url)) {
        if ((this && this.containsVideo && this.containsVideo(url)) || 
        containsVideo(url)) {
            return message_types.video
        } else if ((this && this.containsPhoto &&  this.containsPhoto(url)) || 
        containsPhoto(url)) {
            return message_types.photo
        } else {
            return message_types.text
        }
    } else {
        return message_types.text
    }
}

export function getTypeText(type) {
    return {
        [message_types.audio]: Texts.audio,
        [message_types.photo]: Texts.image,
        [message_types.video]: Texts.video,
        [message_types.file]: Texts.file
    }[type] || Texts.text
}

export function getTypeTextFromURL(url) {
    const type = calculateType(url)
    return getTypeText(type)
}
export function getURLfromType(url) {
    const type = calculateType(url)
    return {
        [message_types.audio]: url.source,
        [message_types.photo]: url.photo,
        [message_types.video]: url.video,
        [message_types.file]: url.source
    }[type] || ""

}