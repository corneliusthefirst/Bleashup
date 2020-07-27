import React, { Component } from "react";
import PublicEvent from './publicEvent';


export default class Relation extends PublicEvent {
  constructor(props) {
    super(props)
    this.state = {}
  }
  state = {} 
  renderTitle() {
    return null
  }
  renderMap() {
    return null
  }

  renderTitle() {
    return this.renderprofile()
  }

  renderMarkAsSeen() {
    return null
  }
  renderFooter() {
    return null
  }

}
