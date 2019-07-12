import React, {Component} from 'react';
import {Platform, StyleSheet,Image,TextInput,FlatList, View,Alert,TouchableHighlight} from 'react-native';

import autobind from "autobind-decorator";
import {
  Content,Card,CardItem,Text,Body,Container,Icon,Header,Form,Item,Title,Input,Left,Right,H3,H1,H2,Spinner,Button,InputGroup,DatePicker,CheckBox,Thumbnail,List
} from "native-base";

import cardListData from './EventData';

import CardListItem from './invitationCard';



class ReceivedInvitations extends Component {
  constructor(props) {
      super(props);
      this.state = ({
          deletedRowKey: null,
        
      });
      
  }
  
 
  


  //callback function to refresh state of change
  refreshCardList = (activeKey) => {
     this.setState((prevState) => {
         return {
             //give the key to delete to the deleted row key
             deletedRowKey: activeKey
         };

     }); 
     //flatlist here is a reference to flatlist
     this.refs.cardlist.scrollToEnd();
  }

 
      /// Adding a new item using a modal
/*   @autobind
  _onPressAdd () {
      //alert("You add Item");
      this.refs.addModal.showAddModal();
  }*/
  render() {

     return (
           <Content>
        
    
           <FlatList 
             //reference name to Flatlist
             ref={"cardlist"}
             data={cardListData}
             renderItem={( {item,index} )=> {
                 //console.log(`Item=${JSON.stringify(item)}, Index = ${index}`);
           
              return(
                     //this is my private class just created
                     <CardListItem item={item} index={index} parentCardList = {this}>
                     </CardListItem>
                 );


             }}
             >
                
             </FlatList>

           </Content>
        
           
     );
  }
}


export default ReceivedInvitations;




















































/*
  <Image source={{uri: 'Image URL'}} style={{height: 200, width: null, flex: 1}}/>
  
<AddModal  ref={'addModal'} parentFlatList={this}>
</AddModal>

<EditModal  ref={'editModal'} parentFlatList={this}>
</EditModal>
*/




































/*import React, { Component } from "react";
import {
  Header,
  Container,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  ScrollableTab,
  Title,
  Icon
} from "native-base";
import NestedScrollView from "react-native-nested-scroll-view";
import GState from "../../../stores/globalState";
class InvitationView extends Component {
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

export default InvitationView;
*/