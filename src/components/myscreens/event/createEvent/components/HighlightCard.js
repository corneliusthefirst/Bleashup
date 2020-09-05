import React, { Component ,PureComponent} from "react";
import { View, Dimensions, Text, TouchableOpacity } from "react-native";
import testForURL from "../../../../../services/testForURL";
import shadower from "../../../../shadower";
import ColorList from "../../../../colorList";
import MedaiView from "./MediaView";
import Social from "./Social";
import Swipeout from '../../../eventChat/Swipeout';
import BePureComponent from '../../../../BePureComponent';
import GState from "../../../../../stores/globalState";
import TextContent from '../../../eventChat/TextContent';
import Creator from "../../../reminds/Creator";

let { height, width } = Dimensions.get("window");

export default class HighlightCard extends BePureComponent {
  constructor(props) {
    super(props);
    this.state = {
      updating: false,
      deleting: false,
      mounted: false,
      isOpen: false,
      check: false,
      master:
        this.props.participant.master == false
          ? this.props.participant.master
          : true,
    };
  }

  containsMedia() {
    return this.props.item.url.video ||
      this.props.item.url.audio ||
      this.props.item.url.photo
      ? true
      : false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.setStatePure({
        mounted: true,
        creator: this.props.computedMaster, //this.props.item.creator === this.props.phone
      });
    }, 50 * this.props.delay);
  }
  container = {
    width: "98%",
    alignSelf: "center",
    ...(!this.props.shadowless && shadower(1)),
    justifyContent: "center",
    margin: "1%",
    backgroundColor: ColorList.bodyBackground,
    borderRadius: 5,
    //borderBottomWidth: 0.5,
    //borderColor: "ivory",
  }
  render() {
    return this.state.mounted ? (
      <Swipeout disabled={false} onLongPress={this.props.showActions} swipeLeft={() => { }} swipeRight={() => {
        this.props.mention(this.props.item)
      }}>
      <View
          onLayout={(e) => {
            this.props.onLayout(e.nativeEvent.layout)}
          }
          style={[this.container, {
            opacity: this.props.isPointed ? .2 : 1,
            backgroundColor: this.props.isPointed ? ColorList.post : ColorList.bodyBackground,
          }]}
      >
        <View
          style={{
            flexDirection: "row",
            width: "97%",
            justifyContent: 'center',
            minHeight: 70,
            alignSelf: "center",
          }}
        >
            <Text
              style={{
                ...GState.defaultTextStyle,
                fontSize: 15,
                marginTop: '2%',

                textAlign:'center',
                color: ColorList.headerBlackText,
                fontWeight: "bold",
                //marginTop: "10%",
              }}
              //numberOfLines={3}
            >
              {this.props.item.title}
            </Text>
        </View>
        <MedaiView
          width={ColorList.containerWidth}
          height={this.props.height}
          showItem={() => this.props.showItem(this.props.item,false,true)}
          url={this.props.item.url||{}}
        ></MedaiView>
        <View
          style={{
            margin: "1%",
          }}
        >
          <TextContent
              text={this.props.item.description ? this.props.item.description :""}
          >
          </TextContent>
        </View>
        <View
          style={{ 
          width: ColorList.containerWidth, 
          alignSelf: "center", 
          alignItems: "center",
          marginLeft: "3%",
          flexDirection: 'row',
          justifyContent: 'space-between', 
        }}
        > 
        <Creator creator={this.props.item.creator}></Creator>
        <Social
            title={this.props.item.title}
            activity_name={this.props.activity_name}
            creator={this.props.item.creator}
            activity_id={this.props.activity_id}
            id={this.props.item.id}
          ></Social>
        </View>
      </View>
      </Swipeout>
    ) : <View style={{ ...this.container, height: 100, ...this.props.item.dimensions}}></View>
  }
}
