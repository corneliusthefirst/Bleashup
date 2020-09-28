import GState from '../../../stores/globalState';


export function showHighlightForScrollToIndex(){
    const id = (this.props.item && this.props.item.id) || 
    (this.props.message && this.props.message.id)
    const isPonted = GState.isPointed(id)
    isPonted && GState.toggleCurrentIndex(id)
    return isPonted
}