import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Text, Spinner, Button, Icon } from "native-base"
import { View } from "react-native"
import BleashupFlatList from '../../BleashupFlatList';
import ProfileView from "../invitations/components/ProfileView";
import { MenuDivider } from 'react-native-material-menu';
import RemindReportContent from "./ReportModal";
export default class ContactsReportModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded: false,
            likers: []
        };
    }
    state = {

    }
    _keyExtractor = (item, index) => item
    componentDidMount() {

    }
    render() {
        return (
            <Modal
                // backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={0.7}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        loaded: false,

                    })
                }
                }
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            loaded: true,
                        })
                    }, 100)
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                {this.state.loaded ? <View>
                    <View style={{ width: "95%", margin: 4, height: 44, flexDirection: 'row', }}>
                        <Text style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 'bold', width: "80%", marginLeft: "5%", }}>{this.props.must_report ? "Remind/Task Completion Report" : "Completed By"}</Text>
                    </View>
                    <View style={{}}>
                        <BleashupFlatList
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={15}
                            numberOfItems={this.props.members.length}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.props.members}
                            renderItem={(item, index) => {
                                this.delay = this.delay >= 15 ? 0 : this.delay + 1
                                return (item && item.phone ? <View>
                                    <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                                        <View style={{ margin: '2%', width: "70%" }}>
                                            <ProfileView delay={this.delay} phone={item.phone}></ProfileView>
                                        </View>
                                        {this.props.must_report ? <Button style={{ flexDirection: 'column', }} onPress={() => {
                                            this.setState({
                                                isReportModalOpened: true,
                                                currentReport: item.status,
                                                currentUser: item
                                            })
                                        }} transparent>
                                            <Icon type="Octicons"
                                                name="report"></Icon><Text>Report</Text></Button> : null}
                                    </View>
                                    <MenuDivider color="#1FABAB" />
                                </View> : null)
                            }}
                        >
                        </BleashupFlatList>
                    </View>
                    <RemindReportContent master={this.props.master} isOpen={this.state.isReportModalOpened}
                        report={this.state.currentReport}
                        user={this.state.currentUser}
                        closed={() => {
                            this.setState({
                                isReportModalOpened: false
                            })
                        }}
                        confirm={() => {
                            this.props.confirm(this.state.currentUser)
                            this.props.onClosed()
                        }}
                    ></RemindReportContent>
                </View> : <Spinner size={'small'}></Spinner>}
            </Modal>

        );
    }
}