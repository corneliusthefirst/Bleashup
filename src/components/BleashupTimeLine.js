"use strict";

import React, { PureComponent } from "react";
import {
    StyleSheet,
    FlatList,
    Image,
    View,
    Text,
    TouchableOpacity
} from "react-native";
import BleashupFlatList from './BleashupFlatList';
import DateView from "./myscreens/eventChat/DateView";
import moment from "moment";
import ChangeBox from "./myscreens/changelogs/ChangesBox";
import shadower from "./shadower";

const defaultCircleSize = 16;
const defaultCircleColor = "#007AFF";
const defaultLineWidth = 1;
const defaultLineColor = "#1FABAB";
const defaultTimeTextColor = "black";
const defaultDotColor = "white";
const defaultInnerCircle = "none";

export default class BleashupTimeLine extends PureComponent {
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
            data: this.props.data,
            //dataSource: ds.cloneWithRows(this.props.data),
            x: 0,
            width: 0
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.data !== nextProps.data) {
            return {
                data: nextProps.data
            };

        }

        return null;
    }
    delayer = 0
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <BleashupFlatList
                    style={[styles.listview, this.props.listViewStyle]}
                    dataSource={this.state.data}
                    inverted={true}
                    firstIndex={0}
                    renderPerBatch={10}
                    initialRender={6}
                    numberOfItems={this.state.data.length}
                    extraData={this.state}
                    renderItem={(item,index) => {
                        this.delayer = this.delayer +1
                        if(this.delayer >= 6) this.delayer = 0
                        return this._renderItem(item,index,this.delayer)
                    }}
                    keyExtractor={(item, index) => index + ""}
                    {...this.props.options}
                />
            </View>
        );
    }

    _renderItem(item, index,delay) {
        let content = null;
        switch (item.type) {
            case "date_separator":
                content = (<View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                    {this.renderTimeSeparator(item)}
                    {null}
                    {null}
                </View>)
                break
            default:
                switch (this.props.columnFormat) {
                    case "single-column-left":
                        content = (
                            <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                                {this.renderTime(item, index)}
                                {this.renderEvent(item, index,delay)}
                                {this.renderCircle(item, index)}
                            </View>
                        );
                        break;
                    case "single-column-right":
                        content = (
                            <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                                {this.renderEvent(item, index,delay)}
                                {this.renderTime(item, index)}
                                {this.renderCircle(item, index)}
                            </View>
                        );
                        break;
                    case "two-column":
                        content =
                            (item.position && item.position == "right") || (!item.position && index % 2 == 0) ? (
                                <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                                    {this.renderTime(item, index)}
                                    {this.renderEvent(item, index,delay)}
                                    {this.renderCircle(item, index)}
                                </View>
                            ) : (
                                    <View style={[styles.rowContainer, this.props.rowContainerStyle]}>
                                        {this.renderEvent(item, index,delay)}
                                        {this.renderTime(item, index)}
                                        {this.renderCircle(item, index)}
                                    </View>
                                );
                        break;
                }
        }
        return <View key={index}>{content}</View>;
    }

    renderTimeSeparator(item) {
        return <View style={{ alignItems: 'flex-end', }}><DateView backgroundColor={"#1FABAB"} date={item.id}></DateView></View>
    }
    _renderTime(rowData, rowID) {
        if (!this.props.showTime) {
            return null;
        }
        var timeWrapper = null;
        switch (this.props.columnFormat) {
            case "single-column-left":
                timeWrapper = {
                    alignItems: "flex-end"
                };
                break;
            case "single-column-right":
                timeWrapper = {
                    alignItems: "flex-start"
                };
                break;
            case "two-column":
                timeWrapper = {
                    flex: 1,
                    alignItems: (rowData.position && rowData.position == "right") || (!rowData.position && rowID % 2 == 0) ? "flex-end" : "flex-start"
                };
                break;
        }
        return (
            <View style={{...timeWrapper}}>
                <View style={[styles.timeContainer, this.props.timeContainerStyle]}>
                    <Text style={[styles.time, this.props.timeStyle]}>
                        {moment(rowData.date).format("hh:mm a")}
                    </Text>
                </View>
            </View>
        );
    }

    _renderEvent(rowData, rowID,delay) {
        const lineWidth = rowData.lineWidth
            ? rowData.lineWidth
            : this.props.lineWidth;
        const isLast = this.props.renderFullLine
            ? !this.props.renderFullLine
            : this.state.data.slice(-1)[0] === rowData;
        const lineColor = isLast
            ? "rgba(0,0,0,0)"
            : rowData.lineColor ? rowData.lineColor : this.props.lineColor;
        let opStyle = null;

        switch (this.props.columnFormat) {
            case "single-column-left":
                opStyle = {
                    borderColor: lineColor,
                    borderLeftWidth: lineWidth,
                    borderRightWidth: 0,
                    marginLeft: 20,
                    paddingLeft: 20
                };
                break;
            case "single-column-right":
                opStyle = {
                    borderColor: lineColor,
                    borderLeftWidth: 0,
                    borderRightWidth: lineWidth,
                    marginRight: 20,
                    paddingRight: 20
                };
                break;
            case "two-column":
                opStyle =
                    (rowData.position && rowData.position == "right") || (!rowData.position && rowID % 2 == 0)
                        ? {
                            borderColor: lineColor,
                            borderLeftWidth: lineWidth,
                            borderRightWidth: 0,
                            marginLeft: 20,
                            paddingLeft: 20
                        }
                        : {
                            borderColor: lineColor,
                            borderLeftWidth: 0,
                            borderRightWidth: lineWidth,
                            marginRight: 20,
                            paddingRight: 20
                        };
                break;
        }

        return (
            <View
                style={[styles.details, opStyle]}
                onLayout={evt => {
                    if (!this.state.x && !this.state.width) {
                        const { x, width } = evt.nativeEvent.layout;
                        this.setState({ x, width });
                    }
                }}
            >
                <TouchableOpacity
                    disabled={this.props.onEventPress == null}
                    style={[this.props.detailContainerStyle]}
                    onPress={() => requestAnimationFrame(() => {
                        this.props.onEventPress ? this.props.onEventPress(rowData) : null
                    })
                    }
                >
                    <View style={styles.detail}>
                        {this.renderDetail(rowData, rowID,delay)}
                    </View>
                    {this._renderSeparator()}
                </TouchableOpacity>
            </View>
        );
    }

    _renderDetail(rowData, rowID,delay) {
        let title = (
            <View>
                <Text style={[styles.title, this.props.titleStyle]}>
                    {rowData.title}
                </Text>
                <View>
                    <ChangeBox master={this.props.master} 
                    showPhoto={url => this.props.showPhoto(url)}
                    restore={(data) => this.props.restore(data)}
                     mention={(data) => this.props.mention(data)} 
                     delayer={delay} change={rowData}></ChangeBox>
                </View>
            </View>
        )
        return <View style={styles.container}>{title}</View>;
    }

    _renderCircle(rowData, rowID) {
        var circleSize = rowData.circleSize
            ? rowData.circleSize
            : this.props.circleSize ? this.props.circleSize : defaultCircleSize;
        var circleColor = rowData.circleColor
            ? rowData.circleColor
            : this.props.circleColor ? this.props.circleColor : defaultCircleColor;
        var lineWidth = rowData.lineWidth
            ? rowData.lineWidth
            : this.props.lineWidth ? this.props.lineWidth : defaultLineWidth;

        var circleStyle = null;

        switch (this.props.columnFormat) {
            case "single-column-left":
                circleStyle = {
                    width: this.state.x ? circleSize : 0,
                    height: this.state.x ? circleSize : 0,
                    borderRadius: circleSize / 2,
                    backgroundColor: "gray",
                    left: this.state.x - circleSize / 2 + (lineWidth - 1) / 2
                };
                break;
            case "single-column-right":
                circleStyle = {
                    width: this.state.width ? circleSize : 0,
                    height: this.state.width ? circleSize : 0,
                    borderRadius: circleSize / 2,
                    backgroundColor: circleColor,
                    left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2
                };
                break;
            case "two-column":
                circleStyle = {
                    width: this.state.width ? circleSize : 0,
                    height: this.state.width ? circleSize : 0,
                    borderRadius: circleSize / 2,
                    backgroundColor: circleColor,
                    left: this.state.width - circleSize / 2 - (lineWidth - 1) / 2
                };
                break;
        }

        var innerCircle = null;
        switch (this.props.innerCircle) {
            case "icon":
                let iconDefault = rowData.iconDefault ? rowData.iconDefault : this.props.iconDefault;
                let iconSource = rowData.icon ? rowData.icon : iconDefault;
                if (rowData.icon) iconSource = rowData.icon.constructor === String ? { uri: rowData.icon } : rowData.icon
                let iconStyle = {
                    height: circleSize,
                    width: circleSize
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
                        : this.props.dotColor ? this.props.dotColor : defaultDotColor
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
    showTime: true
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    listview: {
        flex: 1
    },
    sectionHeader: {
        marginBottom: 15,
        backgroundColor: "#007AFF",
        height: 30,
        justifyContent: "center"
    },
    sectionHeaderText: {
        color: "#FFF",
        fontSize: 18,
        alignSelf: "center"
    },
    rowContainer: {
        flexDirection: "row",
        flex: 1,
        //alignItems: 'stretch',
        justifyContent: "center"
    },
    timeContainer: {
        ...shadower(3),
        borderRadius:5,
        minWidth: 45
    },
    time: {
        textAlign: "right",
        color: defaultTimeTextColor,
        overflow: "hidden"
    },
    circle: {
        width: 16,
        height: 16,
        borderRadius: 10,
        zIndex: 1,
        position: "absolute",
        // left: 0,
        alignItems: "center",
        justifyContent: "center"
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: defaultDotColor
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    details: {
        borderLeftWidth: defaultLineWidth,
        flexDirection: "column",
        flex: 1
    },
    detail: { paddingTop: 10, paddingBottom: 10 },
    description: {
        marginTop: 10
    },
    separator: {
        height: 1,
        backgroundColor: "#aaa",
        marginTop: 10,
        marginBottom: 10
    }
});