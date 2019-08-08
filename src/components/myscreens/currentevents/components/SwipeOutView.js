import React, { Component } from "react"
import { TouchableOpacity, View } from "react-native";
import { List, ListItem, Icon, Label } from "native-base";
export default class SwipeOutView extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            swipperComponent = (<View>
                <List style={{
                    backgroundColor: "#FFFFF6",
                    height: "100%"
                }}>
                    <ListItem style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="forward" type="Entypo">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Publish</Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="universal-access" type="Foundation">
                            </Icon>
                            <Label style={{
                                color: "#1FABAB",
                                fontSize: 12
                            }}
                            >
                                Join
              </Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="calendar" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Detail</Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="comment" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "#1FABAB" }}>chat</Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="exclamation" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Logs</Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem style={{ alignSelf: 'flex-start' }}>
                        <TouchableOpacity>
                            <Icon style={{ fontSize: 16, color: "#1FABAB" }} name="archive" type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "#1FABAB" }}>Hide</Label>
                        </TouchableOpacity>
                    </ListItem>
                    <ListItem>
                        <TouchableOpacity>
                            <Icon name="trash" style={{ fontSize: 16, color: "red" }} type="EvilIcons">
                            </Icon>
                            <Label style={{ fontSize: 12, color: "red" }} >Delete</Label>
                        </TouchableOpacity>
                    </ListItem>
                </List>
            </View>))
    }
}