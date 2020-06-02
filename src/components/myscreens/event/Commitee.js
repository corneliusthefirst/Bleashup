import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, PanResponder } from 'react-native';
import { Text, Content, Icon, Spinner,Title,Thumbnail } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
import BleashupFlatList from '../../BleashupFlatList';
import CommiteeItem from './CommiteeItem';
import BleashupScrollView from '../../BleashupScrollView';
import { union, uniq } from "lodash";
import GState from '../../../stores/globalState';
import emitter from '../../../services/eventEmiter';
import shadower from '../../shadower';
import colorList from '../../colorList';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import { observer } from 'mobx-react';


@observer class Commitee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRoom: "Generale",
            loaded: false
        }
    }
    state = {}
    componentWillMount() {
        emitter.on(this.props.event_id + '_refresh-commitee', () => {
            this.refreshCommitees()
        })
        //console.warn(stores.CommiteeStore.commitees)

    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                loaded: true
            })
        }, 2)
    }
    generalCommitee = {
        id: this.props.event_id,
        name: "General",
        member: this.props.participant,
        opened: true,
        public_state: true,
        creator: this.props.creator
    }
    componentWillUnmount() {
        emitter.off(this.props.event_id + '_refresh-commitee')

    }
    _keyExtractor(item, index) {
        return item
    }
    refreshCommitees() {
        /*this.setState({
            refresh: true
        })
        setTimeout(() => {
            this.setState({
                refresh: false
            })
        }, 100)*/
    }
    delay = 0
    render() {
        return (
            <View style={{ height: "100%", width: "100%"}}>
                
                <View style={{ ...bleashupHeaderStyle, height:colorList.headerHeight, width: "100%",flexDirection:"row",justifyContent:"space-between"}}>
                
                <View style={{height:colorList.headerHeight,alignSelf: "flex-start",justifyContent:"center" }}>
                  <Thumbnail source={require("../../../../assets/committees.png")} style={{width:130,height:32}}></Thumbnail>
                </View>
                <View  style={{height:colorList.headerHeight,justifyContent:"center",marginRight:"5%"}}>
               <TouchableOpacity onPress={() => requestAnimationFrame(() => { this.props.showCreateCommiteeModal() })}>
                  <Icon style={{ color: colorList.bodyIcon,fontSize:22, }}
                     name="plus" type="AntDesign"></Icon></TouchableOpacity>
                </View>      
             </View>

                <View>{!this.state.loaded || this.state.refresh ? null :
                    <View style={{ height: colorList.containerHeight - (colorList.headerHeight + 25), }}>
                        <BleashupFlatList
                        backgroundColor={colorList.bodyBackground}
                        style={{borderTopRightRadius: 5,
                            width: '100%', borderBottomRightRadius: 1, 
                        }}
                            dataSource={union([{...stores.CommiteeStore.generals[this.props.event_id], ...this.generalCommitee}], stores.CommiteeStore.commitees[this.props.event_id])}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(item, index) =>{
                                this.delay = index >= 7 ? 0:this.delay + 1
                               return <CommiteeItem
                                    delay={this.delay}
                                    computedMaster={this.props.computedMaster}
                                    key={index.toString()}
                                    ImICurrentCommitee={item.id && item.id === GState.currentCommitee ||
                                        item === GState.currentCommitee}
                                    master={this.props.master}
                                    event_id={this.props.event_id}
                                    join={(id) => { this.props.join(id) }}
                                    commitee={item.id ? item : null}
                                    leave={(id) => { this.props.leave(id) }}
                                    removeMember={(id, members) => { this.props.removeMember(id, members) }}
                                    addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers) }}
                                    publishCommitee={(id, state) => { this.props.publishCommitee(id, state) }}
                                    editName={this.props.editName}
                                    swapChats={(commitee) => { this.props.swapChats(commitee) }}
                                    phone={this.props.phone}
                                    event_id={this.props.event_id}
                                    newMessagesCount={4}
                                    id={item.id ? item.id : item} ></CommiteeItem>
                            }
                            }
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={14}
                            numberOfItems={stores.CommiteeStore.commitees[this.props.event_id]?
                                stores.CommiteeStore.commitees[this.props.event_id].length:0}
                        /></View>}
                </View>
            </View>
        );
    }
}
export default Commitee