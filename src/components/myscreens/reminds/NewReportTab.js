import React, { PureComponent } from 'react';
import { View, Dimensions } from "react-native"
import { Content, Text, Item, Container, Tabs, Tab, TabHeading } from 'native-base';
import { map } from "lodash"
import Modal from "react-native-modalbox"
import shadower from '../../shadower';
import ConcerneeList from './ConcerneeList';
import DonnersList from './DonnersList';
const screenheight = Math.round(Dimensions.get('window').height);
export default class ReportTabModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null,
            complexReport:false
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='bottom'
                backButtonClose={true}
                swipeToClose={false}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        content: null
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content
                        })
                        this.props.stopLoader()
                    }, 20)
                }}
                style={{
                    height: screenheight * .9,
                    borderTopLeftRadius: 5, borderTopRightRadius: 5,
                    backgroundColor: '#FEFFDE', width: "100%"
                }}
            >
                <Container style={{ margin: "1%" }}>
                    <Text style={{ margin: '1%', color:'#A91A84',fontWeight:'bold'}} note>report</Text>
                    <Tabs tabContainerStyle={{ borderRadius: 8, ...shadower(6) }}>
                        <Tab heading={
                            <TabHeading>
                                <Text>Members</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE', height:'100%'}}>
                                <ConcerneeList
                                    contacts={this.props.concernees}
                                    complexReport={false}
                                    must_report={this.props.must_report}
                                    actualInterval={this.props.actualInterval}
                                ></ConcerneeList>
                            </View>
                        </Tab>
                        <Tab tabStyle={{
                            borderRadius: 8
                        }} heading={
                            <TabHeading>
                                <Text>Done</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE',height:'100%' }}>
                            <DonnersList
                            donners={this.props.donners}
                            master={this.props.master}
                            actualInterval={this.props.actualInterval}
                            confirm={(e) => this.props.confirm(e)}
                            must_report={this.props.must_report}
                            ></DonnersList>
                            </View>
                        </Tab>
                        <Tab heading={
                            <TabHeading>
                                <Text>Confirmed</Text>
                            </TabHeading>
                        }>
                            <View style={{ backgroundColor: '#FEFFDE', height: '100%' }}>
                                <ConcerneeList
                                    master={this.props.master}
                                    contacts={this.props.confirmed}
                                    complexReport={true}
                                    must_report={this.props.must_report}
                                    actualInterval={this.props.actualInterval}
                                >
                                </ConcerneeList>
                            </View></Tab>
                    </Tabs>
                </Container>
            </Modal>
        );
    }
}