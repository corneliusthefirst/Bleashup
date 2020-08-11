/* eslint-disable react-native/no-inline-styles */
import React, { Component, useState } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity, Text } from "react-native";
import BleashupAccordion from "../../MyTasks/BleashupAccordion";
import Hyperlink from "react-native-hyperlink";
import  Entypo from 'react-native-vector-icons/Entypo';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
import GState from "../../../../stores/globalState";

let { height, width } = Dimensions.get("window");

const SwipeAccordion = (props) => {
  const [starselect, setStarselect] = useState(false);

  starClick = () => {
    props.startThis();
    setStarselect(true);
  };

  const renderHeader = (item, index, toggle, expanded) => {
    //console.warn("here i see", item, index, expanded);
    return (
      <View
        style={{
          height: 60,
          width: width,
          flexDirection: "row",
          borderColor: "black",
        }}
      >
        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {starselect ? (
            <Entypo
              style={{ fontSize: 30, color: "white" }}
              type="Entypo"
              name="star"
              onPress={() => this.starClick()}
            />
          ) : (
            <Entypo
              style={{ fontSize: 30, color: "white" }}
              type="Entypo"
              name="star-outlined"
              onPress={() => this.starClick()}
            />
          )}
        </View>

        <View
          style={{
            width: width / 3,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={toggle}>
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 23,
                borderWidth: 0.2,
                borderColor: "white",
                justifyContent: "center",
                alignItems: "center",
                //alignSelf: 'center',
              }}
            >
              {expanded ? (
                <FontAwesome
                  style={{ fontSize: 30, color: "white" }}
                  type="FontAwesome"
                  name="angle-double-down"
                  onPress={toggle}
                />
              ) : (
                <FontAwesome
                  style={{ fontSize: 30, color: "white" }}
                  type="FontAwesome"
                  name="angle-double-up"
                  onPress={toggle}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={props.reply}
          style={{
            width: width / 3,
            borderWidth: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width / 3,
              borderWidth: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Entypo
              style={{ fontSize: 30, color: "white" }}
              type="Entypo"
              name="bell"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = (item) => {
    return item.message ? (
      <View
        style={{
          height: item.message.length > 0 ? height / 4 : 0,
          marginBottom: 0,
        }}
      >
        <ScrollView
          style={{
            height: item.message.length > 0 ? height / 4 : 0,
          }}
        >
          <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9' }}>
            <Text style={{ ...GState.defaultTextStyle, padding: 8, color: 'white' }}>{item.message}</Text>
          </Hyperlink>
        </ScrollView>
      </View>
    ) : null;
  };

  const keyExtractor = (item, index) => item.id;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        //backgroundColor: 'rgba(52,52,52,0.1)',
        width: width,
        borderColor: "black",
        alignItems: "center",
      }}
    >
      <BleashupAccordion
        keyExtractor={keyExtractor}
        dataSource={[props.dataArray]}
        _renderHeader={renderHeader}
        _renderContent={renderContent}
        backgroundColor={'rgba(52,52,52,0.1)'}
      />
    </View>
  );
};

export default SwipeAccordion;
