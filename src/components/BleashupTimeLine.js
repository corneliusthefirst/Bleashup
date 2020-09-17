import React, { PureComponent } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import BleashupFlatList from "./BleashupFlatList";
import DateView from "./myscreens/eventChat/DateView";
import moment from "moment";
import ChangeBox from "./myscreens/changelogs/ChangesBox";
import shadower from "./shadower";
import colorList from "../components/colorList";
import stores from "../stores";
import MessageActions from "./myscreens/eventChat/MessageActons";
import Vibrator from "../services/Vibrator";
import testForURL from "../services/testForURL";
import GState from "../stores/globalState/index";
import TextContent from './myscreens/eventChat/TextContent';
import BeComponent from './BeComponent';

const defaultCircleSize = 16;
const defaultCircleColor = "#007AFF";
const defaultLineWidth = 1;
const defaultLineColor = "#1FABAB";
const defaultTimeTextColor = "black";
const defaultDotColor = "white";
const defaultInnerCircle = "none";

export default class BleashupTimeLine extends BeComponent {
  constructor(props, context) {
    super(props, context);

    this._renderItem = this._renderItem.bind(this);
    this.renderTime = (this.props.renderTime
      ? this.props.renderTime
      : this._renderTime
    ).bind(this);
    this.renderDetail = (this.props.renderDetail
      ? this.props.renderDetail
      : this._renderDetail
    ).bind(this);
    this.renderCircle = (this.props.renderCircle
      ? this.props.renderCircle
      : this._renderCircle
    ).bind(this);
    this.renderEvent = this._renderEvent.bind(this);

    this.state = {
      //dataSource: ds.cloneWithRows(this.props.data),
      x: 0,
      width: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.data !== nextProps.data) {
      return {
        data: nextProps.data,
      };
    }

    return null;
  }
  getItemLayout(item, index) {
    return GState.getItemLayout(item, index, this.props.data);
  }
  componentDidMount() {
    this.props.index || this.props.index >= 0 &&
      setTimeout(() => {
      this.scrollToIndex(this.props.index)
      }, 1000);
  }
  delayer = 0;
  scrollToIndex(index){
    this.refs.changeList && this.refs.changeList.scrollToIndex(index);
  }
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <BleashupFlatList
          marginTop
          ref={"changeList"}
          style={[styles.listview, this.props.listViewStyle]}
          dataSource={this.props.data}
          getItemLayout={this.getItemLayout.bind(this)}
          inverted={true}
          firstIndex={0}
          renderPerBatch={10}
          initialRender={10}
          numberOfItems={this.props.data.length}
          //extraData={this.state}
          renderItem={(rowData, index) => {
            this.delayer = this.delayer + 1;
            if (this.delayer >= 6) this.delayer = 0;
            return (
              <View onLayout={(e) => this.takeNewLayout(e.nativeEvent.layout, 
                rowData, index)}>{this._renderItem(rowData, index, this.delayer)}</View>
            );
          }}
          keyExtractor={(rowData, index) => rowData.id || index.toString()}
          {...this.props.options}
        />
        <MessageActions
          title={"logs actions"}
          onClosed={() => {
            this.setStatePure({
              showActions: false,
            });
          }}
          isOpen={this.state.showActions}
          actions={this.actions}
        ></MessageActions>
      </View>
    );
  }

  _renderItem(rowData, index, delay) {
    let content = null;
    switch (rowData.type) {
      case "date_separator":
        content = (
          <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
            {this.renderTimeSeparator(rowData)}
            {null}
            {null}
          </View>
        );
        break;
      default:
        switch (this.props.columnFormat) {
          case "single-column-left":
            content = (
              <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                {this.renderTime(rowData, index)}
                {this.renderEvent(rowData, index, delay)}
                {this.renderCircle(rowData, index)}
              </View>
            );
            break;
          case "single-column-right":
            content = (
              <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                {this.renderEvent(rowData, index, delay)}
                {this.renderTime(rowData, index)}
                {this.renderCircle(rowData, index)}
              </View>
            );
            break;
          case "two-column":
            content =
              (rowData.position && rowData.position == "right") ||
              (!rowData.position && index % 2 == 0) ? (
                <View
                  style={[styles.rowContainer, this.props.rowContainerStyle]}
                >
                  {this.renderTime(rowData, index)}
                  {this.renderEvent(rowData, index, delay)}
                  {this.renderCircle(rowData, index)}
                </View>
              ) : (
                <View
                  style={[styles.rowContainer, this.props.rowContainerStyle]}
                >
                  {this.renderEvent(rowData, index, delay)}
                  {this.renderTime(rowData, index)}
                  {this.renderCircle(rowData, index)}
                </View>
              );
            break;
        }
    }
    return <View>{content}</View>;
  }

  renderTimeSeparator(rowData) {
    return (
      <View style={{ alignItems: "flex-end" }}>
        <DateView backgroundColor={"#1FABAB"} date={rowData.id}></DateView>
      </View>
    );
  }
  _renderTime(rowData, rowID) {
    if (!this.props.showTime) {
      return null;
    }
    var timeWrapper = null;
    switch (this.props.columnFormat) {
      case "single-column-left":
        timeWrapper = {
          alignItems: "flex-end",
        };
        break;
      case "single-column-right":
        timeWrapper = {
          alignItems: "flex-start",
        };
        break;
      case "two-column":
        timeWrapper = {
          flex: 1,
          alignItems:
            (rowData.position && rowData.position == "right") ||
            (!rowData.position && rowID % 2 == 0)
              ? "flex-end"
              : "flex-start",
        };
        break;
    }
    return (
      <View style={{ ...timeWrapper }}>
        <View style={[styles.timeContainer, this.props.timeContainerStyle]}>
          <Text style={[styles.time, this.props.timeStyle]}>
            {moment(rowData.date).format("hh:mm a")}
          </Text>
        </View>
      </View>
    );
  }

  _renderEvent(rowData, rowID, delay) {
    const lineWidth = rowData.lineWidth
      ? rowData.lineWidth
      : this.props.lineWidth;
    const isLast = this.props.renderFullLine
      ? !this.props.renderFullLine
      : this.state.data.slice(-1)[0] === rowData;
    const lineColor = isLast
      ? "rgba(0,0,0,0)"
      : rowData.lineColor
      ? rowData.lineColor
      : this.props.lineColor;
    let opStyle = null;

    switch (this.props.columnFormat) {
      case "single-column-left":
        opStyle = {
          borderColor: lineColor,
          borderLeftWidth: lineWidth,
          borderRightWidth: 0,
          marginLeft: 20,
          paddingLeft: 20,
        };
        break;
      case "single-column-right":
        opStyle = {
          borderColor: lineColor,
          borderLeftWidth: 0,
          borderRightWidth: lineWidth,
          marginRight: 20,
          paddingRight: 20,
        };
        break;
      case "two-column":
        opStyle =
          (rowData.position && rowData.position == "right") ||
          (!rowData.position && rowID % 2 == 0)
            ? {
                borderColor: lineColor,
                borderLeftWidth: lineWidth,
                borderRightWidth: 0,
                marginLeft: 20,
                paddingLeft: 20,
              }
            : {
                borderColor: lineColor,
                borderLeftWidth: 0,
                borderRightWidth: lineWidth,
                marginRight: 20,
                paddingRight: 20,
              };
        break;
    }

    return (
      <View
        style={[styles.details, opStyle]}
        onLayout={(evt) => {
          if (!this.state.x && !this.state.width) {
            const { x, width } = evt.nativeEvent.layout;
            this.setStatePure({ x, width });
          }
        }}
      >
        <TouchableOpacity
          disabled={this.props.onEventPress == null}
          style={[this.props.detailContainerStyle]}
          onPress={() =>
            requestAnimationFrame(() => {
              this.props.onEventPress ? this.props.onEventPress(rowData) : null;
            })
          }
        >
          <View style={styles.detail}>
            {this.renderDetail(rowData, rowID, delay)}
          </View>
          {this._renderSeparator()}
        </TouchableOpacity>
      </View>
    );
  }
  storesLayouts(event_id, layout, index) {
    stores.ChangeLogs.storeLayouts(event_id, layout, index);
  }
  actions = () => [
    {
      title: "Reply",
      callback: () => this.mention(this.state.selectedItem),
      iconName: "reply",
      condition: () => true,
      iconType: "Entypo",
      color: colorList.replyColor,
    },
  ];
  layoutsTimeout = {};
  selectItem(data, changer) {
    Vibrator.vibrateShort();
    this.setStatePure({
      showActions: true,
      selectedItem: data,
      changer,
    });
  }
  mention(change,changer) {
    let newChanger = changer||this.state.changer
    this.props.mention({
      id: change.id,
      title: `${newChanger.nickname}  ${change.changed} :\n ${
        typeof change.new_value.new_value == "string" &&
        !testForURL(change.new_value.new_value)
          ? change.new_value.new_value
          : ""
      }`,
      type_extern: newChanger.nickname,
      new_value: change.new_value,
      updated: change.updated,
      change_date: change.date,
      replyer_phone: newChanger.phone,
      replyer_name: change.title,
    });
  }
  _renderDetail(rowData, index, delay) {
    let title = (
      <View>
        <TextContent
          numberOfLines={2}
          searchString={this.props.searchString}
          foundString={this.props.foundIndex == index?this.props.searchString:null}
          ellipsizeMode={"tail"}
          style={[GState.defaultTextStyle, styles.title, this.props.titleStyle]}
        >
          {rowData.title}
        </TextContent>
        <ChangeBox
        searchString={this.props.searchString}
        foundString={this.props.foundIndex == index?this.props.searchString:null}
          onLongPress={(changer) => {
            this.selectItem(rowData, changer);
          }}
          showChange={() => this.props.onEventPress(rowData)}
          master={this.props.master}
          showPhoto={(url) => this.props.showPhoto(url)}
          restore={(data) => this.props.restore(data)}
          mention={(data,changer) => this.mention(data,changer)}
          delayer={delay}
          change={rowData}
        ></ChangeBox>
      </View>
    );
    return <View style={styles.container}>{title}</View>;
  }
  takeNewLayout = (layout,rowData,index) => {
  GState.itemDebounce(
    rowData,
    () => {
      this.storesLayouts(rowData.event_id, layout, index);
    },
    500
  );
}
  _renderCircle(rowData, rowID) {
    var circleSize = rowData.circleSize
      ? rowData.circleSize
      : this.props.circleSize
      ? this.props.circleSize
      : defaultCircleSize;
    var circleColor = rowData.circleColor
      ? rowData.circleColor
      : this.props.circleColor
      ? this.props.circleColor
      : defaultCircleColor;
    var lineWidth = rowData.lineWidth
      ? rowData.lineWidth
      : this.props.lineWidth
      ? this.props.lineWidth
      : defaultLineWidth;

    var circleStyle = null;

    switch (this.props.columnFormat) {
      case "single-column-left":
        circleStyle = {
          width: this.state.x ? circleSize : 0,
          height: this.state.x ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: "gray",
          left: this.state.x - circleSize / 2 + (lineWidth - 1) / 2,
        };
        break;
      case "single-column-right":
        circleStyle = {
          width: this.state.width ? circleSize : 0,
          height: this.state.width ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2,
        };
        break;
      case "two-column":
        circleStyle = {
          width: this.state.width ? circleSize : 0,
          height: this.state.width ? circleSize : 0,
          borderRadius: circleSize / 2,
          backgroundColor: circleColor,
          left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2,
        };
        break;
    }

    var innerCircle = null;
    switch (this.props.innerCircle) {
      case "icon":
        let iconDefault = rowData.iconDefault
          ? rowData.iconDefault
          : this.props.iconDefault;
        let iconSource = rowData.icon ? rowData.icon : iconDefault;
        if (rowData.icon)
          iconSource =
            rowData.icon.constructor === String
              ? { uri: rowData.icon }
              : rowData.icon;
        let iconStyle = {
          height: circleSize,
          width: circleSize,
        };
        innerCircle = (
          <Image
            source={iconSource}
            defaultSource={iconDefault}
            style={[iconStyle, this.props.iconStyle]}
          />
        );
        break;
      case "dot":
        let dotStyle = {
          height: circleSize / 2,
          width: circleSize / 2,
          borderRadius: circleSize / 4,
          backgroundColor: rowData.dotColor
            ? rowData.dotColor
            : this.props.dotColor
            ? this.props.dotColor
            : defaultDotColor,
        };
        innerCircle = <View style={[styles.dot, dotStyle]} />;
        break;
    }
    return (
      <View style={[styles.circle, circleStyle, this.props.circleStyle]}>
        {innerCircle}
      </View>
    );
  }

  _renderSeparator() {
    if (!this.props.separator) {
      return null;
    }
    return <View style={[styles.separator, this.props.separatorStyle]} />;
  }
}

BleashupTimeLine.defaultProps = {
  circleSize: defaultCircleSize,
  circleColor: defaultCircleColor,
  lineWidth: defaultLineWidth,
  lineColor: defaultLineColor,
  innerCircle: defaultInnerCircle,
  columnFormat: "single-column-left",
  separator: false,
  showTime: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 15,
    backgroundColor: "#007AFF",
    height: 30,
    justifyContent: "center",
  },
  sectionHeaderText: {
    color: "#FFF",
    fontSize: 18,
    alignSelf: "center",
  },
  rowContainer: {
    flexDirection: "row",
    flex: 1,
    //alignItems: 'stretch',
    justifyContent: "center",
  },
  timeContainer: {
    ...shadower(3),
    borderRadius: 5,
    minWidth: 45,
  },
  time: {
    textAlign: "right",
    color: defaultTimeTextColor,
    overflow: "hidden",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 10,
    zIndex: 1,
    position: "absolute",
    // left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: defaultDotColor,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  details: {
    borderLeftWidth: defaultLineWidth,
    flexDirection: "column",
    flex: 1,
  },
  detail: { paddingTop: 10, paddingBottom: 10 },
  description: {
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#aaa",
    marginTop: 10,
    marginBottom: 10,
  },
});
