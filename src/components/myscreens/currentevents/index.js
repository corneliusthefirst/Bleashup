import React, { Component } from "react";
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  activityIndicatorStyle
} from "react-native";
import imageCacheHoc from "react-native-image-cache-hoc";
const w = Dimensions.get("window");

import {
  Content,
  Card,
  CardItem,
  Container,
  Text,
  Icon,
  Body,
  Left,
  Button,
  Thumbnail,
  DeckSwiper,
  Right,
  Title
} from "native-base";
import ImageActivityIndicator from "./imageActivityIndicator";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
import emitter from "../../../services/eventEmiter";
import stores from "../../../stores";
import { createOpenLink } from "react-native-open-maps";
import UpdateStateIndicator from "./updateStateIndicator";
import Carousel from "react-native-snap-carousel";

const CacheableImage = imageCacheHoc(Image, {
  defaultPlaceholder: {
    component: ImageActivityIndicator,
    props: {
      style: activityIndicatorStyle
    }
  }
});

const Data = [
  {
    tile: "Sample Description",
    Description:
      "sfezrftert everterterterterptertkepg,fg dkglerktletertertertetetlmgfdgmergreggdg ertoeprgkdfgkdlg,dg" +
      "ertfdgdifogdfgkldfgkldfg,ereotpeortgdmfgere" +
      "ezteropnvdfgeprotkpoertdkflg,eritertjedfgllkg,erizeropezksf" +
      "zertprtegszzer",
    image: {
      uri:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
    }
  },
  {
    tile: "Sample Description",
    Description:
      "sfezrftert everterterterterptertkepg,fg dkglerktletertertertetetlmgfdgmergreggdg ertoeprgkdfgkdlg,dg" +
      "ertfdgdifogdfgkldfgkldfg,ereotpeortgdmfgere" +
      "ezteropnvdfgeprotkpoertdkflg,eritertjedfgllkg,erizeropezksf" +
      "zertprtegszzer",
    image: {
      uri:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
    }
  },

  {
    tile: "Sample Description",
    Description:
      "sfezrftert everterterterterptertkepg,fg dkglerktletertertertetetlmgfdgmergreggdg ertoeprgkdfgkdlg,dg" +
      "ertfdgdifogdfgkldfgkldfg,ereotpeortgdmfgere" +
      "ezteropnvdfgeprotkpoertdkflg,eritertjedfgllkg,erizeropezksf" +
      "zertprtegszzer",
    image: {
      uri:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
    }
  }
];

const Query = { query: "central hospital Bertoua" };
const OpenLink = createOpenLink(Query);
const OpenLinkZoom = createOpenLink({ ...Query, zoom: 50 });
export default class CurrentEventView extends Component {
  state = {
    currentIndex: 0
  };
  _renderItem({ item, index }) {
    return (
      <View style={{ borderRadius: 15 }}>
        <Text style={{ borderRadius: 15 }}>{item.tile}</Text>
        <Image source={{ uri: item.image }} />
        <Text>{item.Description}</Text>
      </View>
    );
  }
  render() {
    emitter.emit("test", "testing");
    emitter.on("test", function(testMessage) {
      console.warn(testMessage);
    });
    emitter.on("invitation", Invitation => {
      console.warn(Invitation);
    });
    return (
      <Container>
        <NestedScrollView
          onScroll={nativeEvent => {
            GState.scrollOuter = true;
          }}
          alwaysBounceHorizontal={true}
          scrollEventThrottle={16}
        >
          <Content>
            <Card
              style={{
                padding: 10,
                borderColor: "#1FABAB",
                border: 50,
                height: 500
              }}
              bordered
            >
              <CardItem>
                <Left>
                  <Icon
                    name="thumbs-up"
                    type="Entypo"
                    style={{ color: "#0A4E52", fontSize: 16 }}
                  />
                  <Text note>31 Likers</Text>
                </Left>
                <UpdateStateIndicator />
                <Right>
                  <Icon
                    name="dots-three-vertical"
                    style={{ color: "#0A4E52", fontSize: 16 }}
                    type="Entypo"
                  />
                </Right>
              </CardItem>
              <CardItem
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Roboto"
                  }}
                >
                  Dancing Event Dancing Event Dancing Event
                </Text>
                <Text style={{ color: "#1FABAB" }} note>
                  15-26-2019 14:54 PM
                </Text>
              </CardItem>
              <CardItem
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 20,
                  paddingBottom: 10
                }}
                cardBody
              >
                <Left>
                  <View>
                    <CacheableImage
                      source={{
                        uri:
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/GDC_onlywayaround.jpg/300px-GDC_onlywayaround.jpg"
                      }}
                      parmenent={false}
                      style={{
                        height: 125,
                        width: 180,
                        borderRadius: 15
                      }}
                      resizeMode="contain"
                      onLoad={() => {}}
                    />
                  </View>
                </Left>
                <Right>
                  <View>
                    <TouchableOpacity>
                      <Text ellipsizeMode="clip" numberOfLines={2}>
                        General Hospital Bertoua
                      </Text>
                    </TouchableOpacity>
                    <TouchableHighlight onPress={OpenLinkZoom}>
                      <Image
                        source={require("../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                        style={{ height: 60, width: 100, borderRadius: 15 }}
                        resizeMode="contain"
                        onLoad={() => {}}
                      />
                    </TouchableHighlight>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <TouchableOpacity onPress={OpenLink}>
                        <Text note> View On Map </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Right>
              </CardItem>
              <CardItem>
                <View>
                  <DeckSwiper
                    ref={c => (this._deckSwiper = c)}
                    dataSource={Data}
                    renderItem={item => (
                      <Card style={{ elevation: 3, width: 380, height: 250 }}>
                        <Text note>Description</Text>
                        <CardItem style={{ paddingBottom: 10 }}>
                          <View>
                            <Text>{item.tile}</Text>
                          </View>
                        </CardItem>
                        <CardItem cardBody>
                          <Icon
                            name="caretleft"
                            type="AntDesign"
                            style={{}}
                            onPress={() => this._deckSwiper._root.swipeLeft()}
                          />

                          <Left>
                            <Image
                              style={{ width: 300, height: 80 }}
                              source={item.image}
                              resizeMode="contain"
                            />
                            <Icon
                              name="caretright"
                              type="AntDesign"
                              onPress={() =>
                                this._deckSwiper._root.swipeRight()
                              }
                            />
                          </Left>
                        </CardItem>
                      </Card>
                    )}
                  />
                </View>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text>
                    NativeBase gives you the potential of building applications
                    that run on iOS and Android using a single codebase.
                  </Text>
                </Body>
              </CardItem>
            </Card>
          </Content>
        </NestedScrollView>
      </Container>
    );
  }
}
