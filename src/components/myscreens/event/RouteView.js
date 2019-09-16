import React,{Component} from "react"
import { TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Card, CardItem, Text, Icon } from 'native-base';
export default class RouteView extends Component {
    constructor(props){
        super(props)
    }
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    render(){
        return (
            <Card style={{ height: 300, width: 200 }} transparent>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventDetails" ? "#54F5CA" : null,
                    width: "100%", borderTopLeftRadius: 12, borderTopWidth: 2, borderLeftWidth: 2, borderTopColor: "#1FABAB", borderLeftColor: "#1FABAB",
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("EventDetails")) }>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Icon type="AntDesign" style={{ color: this.original }} name="appstore1"></Icon>
                            <Text style={{ padding: "1%", }}>Activity Details</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{ height: this.height, backgroundColor: this.props.currentPage == "ChangeLogs" ? "#54F5CA" : null, borderLeftColor: "#1FABAB", borderLeftWidth: 2, }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("ChangeLogs")) }>
                        <View style={{ display: 'flex', flexDirection: 'row',}}>
                            <Icon type="Entypo" style={{ color: this.original }} name="clock"></Icon>
                            <Text style={{ padding: "1%", }}>History Logs</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "EventChat" ? "#54F5CA" : null,
                    borderLeftColor: "#1FABAB", borderLeftWidth: 2,
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("EventChat"))}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Icon type="FontAwesome" style={{ color: this.original }} name="group"></Icon>
                            <Text style={{ padding: "1%", }}>Discusion</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{ height: this.height, backgroundColor: this.props.currentPage == "Highlights" ? "#54F5CA" : null, borderLeftColor: "#1FABAB", borderLeftWidth: 2, }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("Highlights"))}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="AntDesign" style={{ color: this.original }} name="star"></Icon>
                            <Text style={{ padding: "1%" }}>HighLights</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Reminds" ? "#54F5CA" : null,
                    borderLeftColor: "#1FABAB", borderLeftWidth: 2
                }} >
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("Reminds"))}>
                        <View style={{ display: 'flex', flexDirection: 'row',  }}>
                            <Icon type="Entypo" style={{ color: this.original }} name="bell"></Icon>
                            <Text style={{ padding: "1%" }}>Reminds/Tasks</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, borderLeftColor: "#1FABAB", borderLeftWidth: 2,
                    backgroundColor: this.props.currentPage == "Votes" ? "#54F5CA" : null, width: "100%"
                }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => this.props.setCurrentPage("Votes"))}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="FontAwesome5" style={{ color: this.original }} name="poll"></Icon>
                            <Text style={{ padding: "1%", }}>Polls/Votes</Text>
                        </View>
                    </TouchableOpacity>
                </CardItem>
                <CardItem style={{
                    height: this.height, backgroundColor: this.props.currentPage == "Contributions" ? "#54F5CA" : null,
                    borderBottomColor: "#1FABAB", borderBottomWidth: 2, borderBottomLeftRadius: 12, borderLeftColor: "#1FABAB",
                    borderLeftWidth: 2,
                }}>
                    <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                        this.props.setCurrentPage("Contributions")
                    })}>
                        <View style={{ display: 'flex', flexDirection: 'row', }}>
                            <Icon type="MaterialIcons" style={{ color: this.original }} name="monetization-on"></Icon>
                            <Text style={{ padding: "1%", }}>Contributions</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </CardItem>
            </Card>
        )
    }
} 