import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import stores from "../../../../stores";
import { find } from "lodash";
import BeNavigator from "../../../../services/navigationServices";
import ColorList from "../../../colorList";
import BePureComponent from '../../../BePureComponent';
import emitter from "../../../../services/eventEmiter";
import { sayTyping } from '../../eventChat/services';
import GState from '../../../../stores/globalState/index';
import Texts from '../../../../meta/text';
import TextContent from "../../eventChat/TextContent";
export default class TitleView extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDetailsModalOpened: false,
      isJoining: false,
    };
    this.goToEventDetails = this.goToEventDetails.bind(this);
  }
  componentMounting(){
    emitter.on(`${this.props.Event.id}_typing`,(typer) => {
    !this.sayTyping ? this.sayTyping = sayTyping.bind(this): null;
      this.sayTyping(typer)
    })
  }
  unmountingComponent(){
    emitter.off(`${this.props.Event.id}_typing`)
  }
  componentDidMount() {

  }
  navigateToEventDetails() {
    stores.Events.isParticipant(
      this.props.Event.id,
      stores.Session.SessionStore.phone
    ).then((status) => {
      if (status) {
        BeNavigator.navigateToActivity(
          "EventChat",
          find(stores.Events.events, { id: this.props.Event.id })
        );
      } else {
        this.props.openDetail && this.props.openDetail();
      }
      this.props.seen && this.props.seen();
    });
  }
  goToEventDetails() {
    requestAnimationFrame(() => {
      this.navigateToEventDetails();
    });
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <TouchableOpacity
          style={styles.subContainer}
          onPress={this.goToEventDetails}
        >
          <View style={styles.titleContainer}>
            <TextContent
            onPress={this.goToEventDetails}
            numberOfLines={1}
              adjustsFontSizeToFit={true}
              searchString={this.props.searchString}
              style={styles.titleTextStyles}
              ellipsizeMode="tail">
              {this.props.Event.about.title}
            </TextContent>
          </View>
          {this.state.typing && <Text style={[GState.defaultTextStyle,{fontSize: 12,
            color:ColorList.indicatorColor}]}>{`${this.state.typer} is ${Texts.typing}`}</Text>}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, marginTop: "2.5%" },
  subContainer: {
    height: "100%",
  },
  titleContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  highlightStyle: {
    backgroundColor: ColorList.iconInactive,
    fontWeight: "bold",
    color: ColorList.bodyBackground,
  },
  titleTextStyles: {
    fontSize: 14,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "black",
    fontFamily: "Roboto",
  },
});
