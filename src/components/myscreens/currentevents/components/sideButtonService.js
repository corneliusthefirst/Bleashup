

export function _onScroll(event) {
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
        ? 'down'
        : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
        this.setStatePure({ isActionButtonVisible })
    }
    this._listViewOffset = currentOffset
}