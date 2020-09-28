
import GState from '../../../stores/globalState/index';
// ! All functions in this file are declared by bindiing this like this.finish = finish.bind(this)
//! This declaration is adviced to be done in constructor of the class they are going to be used
//! All functions of this service are design to work only within a class out of class they crash
/**
 * 
 * @param {string} currentIndex 
 * your class must implement a scrollToIndex
 */
export function finish(currentIndex){
    let scrollIndex = this.state.searchResult[currentIndex].index
    GState.toggleCurrentIndex(this.data[scrollIndex].id,
        4000)
    this.scrollToIndex && this.scrollToIndex(scrollIndex)
    this.setStatePure && this.setStatePure({
        foundIndex: scrollIndex,
        currentSearchIndex: currentIndex
    })
}

export function pushSearchUp(){
    let currentIndex = this.state.currentSearchIndex + 1
    if (currentIndex >= 0 &&
        currentIndex <= this.state.searchResult.length - 1) {
       this.finish && this.finish(currentIndex)
    } else {
        currentIndex = 0
        this.finish  && this.finish(0)
    }
}

export function pushSearchDown(){
    let currentIndex = this.state.currentSearchIndex - 1
    if (currentIndex >= 0 &&
        currentIndex <= this.state.searchResult.length - 1) {
        this.finish(currentIndex)
    } else {
        currentIndex = this.state.searchResult.length - 1
        this.finish(currentIndex)
    }
}
/**
 * 
 * @param {string} text 
 * your class must define a filterFunc
 */
export function computeSearch(text){
    let searchResult = []
    this.data.forEach((ele, index) => {
        if (this.filterFunc(ele, text,this.props.isRelation)) {
            searchResult.push({ index })
        }
    })
    this.setStatePure({
        searchString: text,
        foundIndex: -1,
        currentSearchIndex: -1,
        searchResult
    })
}

export function cancelSearch() {
    this.setStatePure({
        searching: false,
        searchString: ""
    })
}

export function startSearching() {
    this.setStatePure({
        searching: true
    })
}
export function justSearch(text){
    this.setStatePure({
        searchString:text
    })
}
export function search(text) {
    this.computeSearch(text)

}