import React, { PureComponent } from "react";

import { TouchableOpacity, View, Image } from "react-native";
import Modal from "react-native-modalbox";
import {
  Content,
  Header,
  Item,
  Input,
  Left,
  Right,
  Icon,
  Body,
  Title,
  Label,
  Text,
  Container,
  CheckBox
} from "native-base";
import stores from "../../../../stores";
import ProfileView from "../../invitations/components/ProfileView";
import { FlatList } from "react-native-gesture-handler";
import ListItem from "../../../../native-base-theme/components/ListItem";

export default class InvitationModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inviteViaEmail: false,
      contacts: [],
      selectedContacts: []
    };
    this.contacts = [];
    this.previousState = this.state.inviteViaEmail;
  }
  renderItem = ({ item, index }) => {
    return (
      <View>
      <CheckBox checked={false}/>
          <ProfileView phone={item.host}></ProfileView>
    </View>
  )
    };
  componentDidMount() {
    stores.Contacts.getContacts(stores.Session.SessionStore.phone).then(  
      contacts => {
        this.setState({ contacts: contacts });
      }
    );
  }
  translateToSimpleContacts(contacts) {
    return new Promise((resolve, reject) => {
      let result = [];
      let i = 0;
      contacts.forEach(element => {
        result.push(element.phone);
        if (i == contacts.length - 1) resolve(result);
        i++;
      });
    });
  }
  _keyExtractor = (item, index) => item;
  render() {
    return (
      <Modal
        backdropOpacity={0.7}
        backButtonClose={true}
        position={"top"}
        coverScreen={true}
        isOpen={this.props.isOpen}
        onClosed={() => this.props.close()}
        style={{
          height: this.state.inviteViaEmail ? "30%" : "100%",
          borderRadius: 8,
          backgroundColor: "#FEFFDE",
          width: this.state.inviteViaEmail ? "90%" : "99%"
        }}
      >
        <Container>
          <Header>
            <Left>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ inviteViaEmail: !this.state.inviteViaEmail });
                }}
              >
                <Icon
                  style={{ color: "#FEFFDE", paddingLeft: "5%" }}
                  type={"Entypo"}
                  name={this.state.inviteViaEmail ? "users" : "mail"}
                />
                <Label style={{ fontSize: 12, color: "#FEFFDE" }}>
                  {this.state.inviteViaEmail ? "Contacts" : "Via Mail"}
                </Label>
              </TouchableOpacity>
            </Left>
            {this.state.inviteViaEmail ? null : (
              <Text
                style={{
                  marginTop: "4%",
                  marginLeft: "4%",
                  fontWeight: "bold",
                  color: "#FEFFDE"
                }}
              >
                Select contacts
              </Text>
            )}
            <Right>
              <TouchableOpacity onPress={() => this.props.close()}>
                <Icon
                  style={{ color: "#FEFFDE" }}
                  type="EvilIcons"
                  name="close"
                />
              </TouchableOpacity>
            </Right>
          </Header>
          {this.state.inviteViaEmail ? (
            <Content>
              <Item>
                <Input placeholder="phone/email" />
              </Item>
              <Item>
                <Input placeholder="status:master/simple member" />
              </Item>
            </Content>
          ) : (
            <Content>
              <FlatList
                initialNumToRender={15}
                maxToRenderPerBatch={8}
                windowSize={20}
                ref={"cardlist"}
                onContentSizeChange={() => this.refs.cardlist.scrollToEnd()}
                updateCellsBatchingPeriod={25}
                listKey={"contacts"}
                keyExtractor={this._keyExtractor}
                data={this.state.contacts}
                renderItem={this.renderItem}
              ></FlatList>
            </Content>
          )}
        </Container>
      </Modal>
    );
  }
}
