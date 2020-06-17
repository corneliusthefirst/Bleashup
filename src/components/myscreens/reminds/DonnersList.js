import React, { Component } from 'react';
import { View, Button, Text, Icon } from 'native-base';
import BleashupFlatList from '../../BleashupFlatList';
import IntervalSeparator from './IntervalSeparator';
import { MenuDivider } from 'react-native-material-menu';
import ProfileView from '../invitations/components/ProfileView';
import RemindReportContent from './ReportModal';
import AccordionModuleNative from '../MyTasks/BleashupAccordion';

export default class DonnersList extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    state = {

    }
    onItemExpand(item) {
        let donners = this.props.donners(item)
        this.setState({
            donners: donners
        })
    }
    renderHeader(item, index,toggle) {
        return <IntervalSeparator onPress={() => toggle()}
            actualInterval={this.props.actualInterval && item.start === this.props.actualInterval.start &&
                item.end === this.props.actualInterval.end} first={index == 0 ? true : false} from={item.start} to={item.end}></IntervalSeparator>
    }
    keyExtractor = (item) => item.start + "-" + item.end
    delay = 0
    renderItems(ParentItem) {
        let donners = this.state.donners || []
        return <View style={{ width: '100%', maxHeight: 400 }}>
            <BleashupFlatList
                fit
                firstIndex={0}
                renderPerBatch={7}
                initialRender={20}
                numberOfItems={donners.length}
                keyExtractor={(item, index) => item.phone}
                dataSource={donners}
                renderItem={(item, index) => {
                    this.delay = this.delay >= 20 ? 0 : this.delay + 1
                    return (item.type ? <IntervalSeparator
                        actualInterval={this.props.actualInterval && item.from === this.props.actualInterval.start &&
                            item.to === this.props.actualInterval.end} first={index == 0 ? true : false} from={item.from} to={item.to}></IntervalSeparator>
                        : item.phone ? <View style={{ width: "90%", alignSelf: 'center', minHeight: 53, }}>
                            <View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{ width: "70%", alignSelf: 'center', }}>
                                    <ProfileView delay={this.delay} phone={item.phone}></ProfileView>
                                </View>
                                {this.props.must_report && !this.props.cannotReport ?
                                    <Button style={{ flexDirection: 'column', }} onPress={() => {
                                        this.setState({
                                            isReportModalOpened: true,
                                            interval: ParentItem,
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
    }
    render() {
        return <View>
            <AccordionModuleNative
                hideToggler
                keyExtractor={this.keyExtractor}
                _renderHeader={this.renderHeader.bind(this)}
                _renderContent={this.renderItems.bind(this)}
                dataSource={this.props.intervals}
                onExpand={this.onItemExpand.bind(this)}
            >
            </AccordionModuleNative>
            {this.state.isReportModalOpened ? <RemindReportContent master={this.props.master} isOpen={this.state.isReportModalOpened}
                report={this.state.currentReport}
                user={this.state.currentUser}
                closed={() => {
                    this.setState({
                        isReportModalOpened: false
                    })
                }}
                confirm={() => {
                    console.warn(this.state.interval, "interval from confirm")
                    this.props.confirm(this.state.currentUser, this.state.interval)
                    //this.props.onClosed()
                }}
            ></RemindReportContent> : null}</View>
    }
}