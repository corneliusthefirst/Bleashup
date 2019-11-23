import React, { PureComponent } from 'react';
import Modal from "react-native-modalbox"
import { Header, Left, Icon, Text, Label, Right, Title } from 'native-base';
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';
//import BleashupFlatList from './BleashupFlatList';
//import ProfileWithCheckBox from './myscreens/currentevents/components/PofileWithCheckbox';
import { indexOf, reject, concat, find } from "lodash"
import CacheImages from '../../CacheImages';
export default class NotificationModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            members: []
        }
    }
    state = {

    }
    componentDidMount() {
        setTimeout(() =>
            this.setState({
                checked: this.props.members,
                members: this.props.members,
                check: this.props.notcheckall ? false : true
            })
            , 200)
    }
    _keyExtractor = (item, index) => { return item ? item.phone : null };
    render() {
        return (
            <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                console.warn("pressing")
            })
            }>
                <Modal
                    //backdropPressToClose={false}
                    backdropOpacity={0}
                    swipeToClose={true}
                    backButtonClose={true}
                    position={"top"}
                    entry={"top"}
                    //coverScreen={false}
                    isOpen={this.props.isOpen}
                    onClosed={() => {
                        this.setState({
                            members: [],
                            checked: [],
                            check: true
                        })
                        this.props.close()
                    }}
                    onOpened={() => {
                        this.setState({

                        })
                    }}
                    style={{
                        marginTop: "10%",
                        height: "260%",
                        borderRadius: 10,
                        borderWidth: 0.2,
                        marginLeft: "16%",
                        borderColor: "#1FABAB",
                        borderBottomRightRadius: 8,
                        backgroundColor: "#FEFFDE",
                        width: "65%"
                    }}
                >
                    <View style={{ margin: '2%', position: "absolute" }}>
                        <View style={{ flexDirection: 'column', }}>
                            <View style={{ flexDirection: 'row', }}>
                                <CacheImages thumbnails
                                    source={{ uri: "https://images.all-free-download.com/images/graphicthumb/peacock_profile_514065.jpg" }}>
                                </CacheImages>
                                <View style={{ marginTop: "3%", marginLeft: "2%", flexDirection: 'column', }}>
                                    <Text style={{ marginBottom: "2%", fontWeight: '400', }}>Fokam Giles</Text>
                                    <Text style={{ marginLeft: "2%" }} note>Santers here i am yeahh</Text>
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ fontWeight: 'bold', }}>Changed </Text><Text>{"The Name Of A Commitee To: "}</Text>
                                </View>
                                <Text style={{ fontStyle: 'italic', }}>New Name</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
        );
    }
} 