import React, { PureComponent } from 'react';

export default class BePureComponent extends PureComponent {

    componentWillMount() {
        this.mounted = true
        this.componentMounting()
    }
    setStatePure(state, callback) {
        this.mounted && this.setState(state, callback)
    }
    componentMounting() {

    }
    openModalTimeout = null
    componentWillUnmount() {
        this.mounted = false
        this.openModalTimeout && clearTimeout(this.openModalTimeout)
        this.mountTimeout && clearTimeout(this.mountTimeout)
        this.unmountingComponent()
    }
    unmountingComponent() {

    }
}