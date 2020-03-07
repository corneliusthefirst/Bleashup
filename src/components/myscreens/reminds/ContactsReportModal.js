import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { Text, Spinner, Button, Icon } from "native-base"
import { View } from "react-native"
import BleashupFlatList from '../../BleashupFlatList';
import ProfileView from "../invitations/components/ProfileView";
import { MenuDivider } from 'react-native-material-menu';
import RemindReportContent from "./ReportModal";
import IntervalSeparator from "./IntervalSeparator";
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
                swipeToClose={false}
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
                    <View style={{ width: "95%", margin: 4, height: '5%', flexDirection: 'row', }}>
                        <Text style={{ fontSize: 22, fontStyle: 'italic', fontWeight: '400', width: "80%", marginLeft: "5%", }}>{ "Completion report"}</Text>
                    </View>
                    <View style={{ height: '93%' }}>
                        <BleashupFlatList
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={15}
                            numberOfItems={this.props.members.length}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.props.members}
                            renderItem={(item, index) => {
                                this.delay = this.delay >= 15 ? 0 : this.delay + 1
                                return (item.type ? <IntervalSeparator
                                    actualInterval={this.props.actualInterval && item.from === this.props.actualInterval.start &&
                                        item.to === this.props.actualInterval.end} first={index == 0 ? true : false} from={item.from} to={item.to}></IntervalSeparator> : item.data && item.data.phone ? <View>
                                            <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                                                <View style={{ margin: '2%', width: "70%" }}>
                                                    <ProfileView delay={this.delay} phone={item.data.phone}></ProfileView>
                                                </View>
                                                {this.props.must_report ? <Button style={{ flexDirection: 'column', }} onPress={() => {
                                                    this.setState({
                                                        isReportModalOpened: true,
                                                        currentReport: item.data.status,
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
                    {this.state.isReportModalOpened ? <RemindReportContent master={this.props.master} isOpen={this.state.isReportModalOpened}
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
                    ></RemindReportContent> : null}
                </View> : <Spinner size={'small'}></Spinner>}
            </Modal>

        );
    }
}