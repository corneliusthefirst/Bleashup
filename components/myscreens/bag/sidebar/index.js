import React, { Component } from "react";
import { Image } from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import styles from "./style";

const drawerCover = require("../../../assets/hibou.jpg");
const drawerImage = require("../../../assets/hibou.jpg");
const datas = [
  {
    name: "Profile",
    route: "Profile",
    icon: ""
   // bg: "#C5F442"
  },
  {
    name: "Invitations",
    route: "SendEvents",
    icon: ""
   // bg: "#477EEA",
    //types: "11"
  },
  {
    name: "Created Events",
    route: "ReceivedEvents",
    icon: ""
    //bg: "#DA4437",
   // types: "4"
  },
  {
    name: "Trash",
    route: "Trash",
    icon: ""
   // bg: "#C5F442",
    //types: "5"
  },
  {
    name: "My Reminds",
    route: "MyReminds",
    icon: ""
    //bg: "#C5F442"
  },
  {
    name: "Contacts",
    route: "Contacts",
    icon: ""
    //bg: "#4DCAE0"
  },
  {
    name: "Notifications",
    route: "Notifications",
    icon: ""
    //bg: "#1EBC7C",
    //types: "9"
  },
  {
    name: "Help",
    route: "Help",
    icon: ""
   // bg: "#B89EF5",
    //types: "8"
  }
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <Image source={drawerCover} style={styles.drawerCover} />
          <Image square style={styles.drawerImage} source={drawerImage} />

          <List
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.props.navigation.navigate(data.route)}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 25 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>

              </ListItem>}
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;
