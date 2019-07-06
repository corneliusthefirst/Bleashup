import React, { Component } from "react";
import {Platform, StyleSheet,Image,TextInput,FlatList, ActivityIndicator, View,Alert,TouchableHighlight} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Thumbnail,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,CheckBox,List,Accordion,DeckSwiper
} from "native-base";

import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
//import styles from './style';



class SentInvitations extends Component {
  render() {
    return (
      <Container>
        <NestedScrollView
          onScroll={nativeEvent => {
            GState.scrollOuter = true;
          }}
          alwaysBounceHorizontal={true}
          scrollEventThrottle={16}
        >
          <Content padder>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>

                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>

            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
                  </Text>
                </Body>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Body>
                  <Text> </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text> Platform specific codebase for components </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Any native third - party libraries can be included along
                    with NativeBase.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Single file to theme your app and NativeBase components.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    Gives an ease to include different font types in your app.
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

export default SentInvitations;
