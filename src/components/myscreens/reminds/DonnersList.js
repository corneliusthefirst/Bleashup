import React, { Component } from 'react';
import { View, Button, Text, Icon } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import IntervalSeparator from './IntervalSeparator';
import { MenuDivider } from 'react-native-material-menu';
import ProfileView from '../invitations/components/ProfileView';
import RemindReportContent from './ReportModal';

export default class DonnersList extends Component{
    constructor(props){
        super(props)
        this.state = {

        }
    }
    state={

    }
    _keyExtractor = (item, index) => index.toString()
    delay = 0
    render(){
        return <View>
            <BleashupFlatList
                firstIndex={0}
                renderPerBatch={7}
                initialRender={15}
                numberOfItems={this.props.donners.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.props.donners}
                renderItem={(item, index) => {
                    this.delay = this.delay >= 15 ? 0 : this.delay + 1
                    return (item.type ? <IntervalSeparator
                        actualInterval={this.props.actualInterval && item.from === this.props.actualInterval.start &&
                            item.to === this.props.actualInterval.end} first={index == 0 ? true : false} from={item.from} to={item.to}></IntervalSeparator> 
                            : item.data && item.data.phone ? <View>
                                <View style={{ display: 'flex', flexDirection: 'row', width: "100%" }}>
                                    <View style={{ margin: '2%', width: "70%" }}>
                                        <ProfileView delay={this.delay} phone={item.data.phone}></ProfileView>
                                    </View>
                                    {this.props.must_report ? 
                                        <Button style={{ flexDirection: 'column', }} onPress={() => {
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
                    //this.props.onClosed()
                }}
            ></RemindReportContent> : null}
        </View>
    }
}