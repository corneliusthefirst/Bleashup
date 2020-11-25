import React from "react"
import BleashupModal from '../../mainComponents/BleashupModal';
import { View, Text, TouchableOpacity } from 'react-native';
import GState from "../../../stores/globalState";
import Texts from '../../../meta/text';
import BleashupFlatList from "../../BleashupFlatList";
import ProfileView from "../invitations/components/ProfileView";
import Entypo from 'react-native-vector-icons/Entypo';
import ColorList from '../../colorList';
import rounder from "../../../services/rounder";
import shadower from "../../shadower";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Searcher from "../Contacts/Searcher";
import { justSearch, startSearching, cancelSearch } from './searchServices';
import globalFunctions from '../../globalFunctions';
import Vibrator from '../../../services/Vibrator';
import { uniqBy } from 'lodash';

export default class PrivateReplyModal extends BleashupModal {
    initialize() {
        this.state = {
            currentLength: 1
        }
        this.search = justSearch.bind(this)
        this.startSearching = startSearching.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
    }
    onClosedModal() {
        this.props.onClosed()
    }
    componentDidUpdate(prevProp, preState){
        if(this.state.searchString !== preState.searchString){
            this.toggleList()
        }
    }
    swipeToClose = false
    modalHeight = this.height * .50
    borderRadius = 10
    modalWidth = "70%"
    borderTopLeftRadius = 10
    onOpenModal() {
        setTimeout(() => {
            this.setStatePure({
                currentLength: 1,
            })
        })
    }
    data = this.props.members
    position = "center"
    entry = "top"
    toggleList(currelyAll) {
        this.setStatePure({
            currentLength: currelyAll ? 1 : this.props.members.length
        })
    }
    borderTopRightRadius = 10
    modalMinHieight = 50
    
    modalBody() {
        this.data = this.props.members && this.props.members.slice(0, this.state.currentLength)
        this.data = this.data.filter(ele => globalFunctions.filterForRelation(ele,this.state.searchString || ""))
        this.data = uniqBy(this.data,'phone')
        let isAll = this.state.currentLength > 1 && this.data.length > 1
        return <View>
            <View style={{
                margin: '2%',
                flexDirection: 'row',alignSelf: 'center',
                width:'95%',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                {!this.state.searching ? <View>
                    <Text style={{
                        fontWeight: 'bold',
                        ...GState.defaultTextStyle
                    }}>
                        {Texts.reply_privately_to}
                    </Text>
                </View> : null}
                <View style={{
                    height: 35,
                    flex: this.state.searching ? 1 : null,
                    width: this.state.searching ? null : 35
                }}>
                    <Searcher
                        searching={this.state.searching}
                        search={this.search}
                        searchString={this.state.searchString}
                        startSearching={this.startSearching}
                        cancelSearch={this.cancelSearch}
                    >
                    </Searcher>
                </View>
            </View>
            <View style={{
                maxHeight: isAll ? this.modalHeight*.7 : 60
            }}>
                <BleashupFlatList
                    fit
                    numberOfItems={this.data.length}
                    initialRender={10}
                    keyExtractor={(item, index) => item.phone}
                    renderItem={(item, index) => <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: '2%',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{
                            flex: 1,
                        }}>
                            <ProfileView searchString={this.state.searchString} phone={item.phone}></ProfileView>
                        </View>
                        {item.phone == this.props.author ? <View style={{
                            width: 50,
                            height: 20,
                            marginHorizontal: '2%',
                            borderRadius: 10,
                            backgroundColor: ColorList.bodyBackground,
                            ...shadower(1),
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{
                                ...GState.defaultTextStyle,
                                color: ColorList.orangeColor,
                                fontWeight: 'bold',

                            }}>{Texts.author}</Text>
                        </View> : null}
                        <TouchableOpacity style={{
                            ...rounder(40, ColorList.bodyDarkWhite),
                            justifyContent: 'center',
                        }} onPress={() => {
                            requestAnimationFrame(() => {
                                Vibrator.vibrateShort()
                                this.props.replyWith(item)
                            })
                        }}><Entypo style={{
                            ...GState.defaultIconSize,
                            color: ColorList.indicatorColor
                        }} name={"reply"}></Entypo></TouchableOpacity>
                    </View>}
                    renderPerBatch={10}
                    dataSource={this.data}
                >
                </BleashupFlatList>
            </View>
            <TouchableOpacity 
            onPress={() => this.toggleList(isAll)}
            style={{
                margin: '1%',
                borderRadius: 10,
                borderTopLeftRadius: 0,
                borderTopLeftRadius: 0,
                paddingHorizontal: '2%',
                flexDirection: 'row',
                alignItems: 'center',
                height: 35,
                backgroundColor: ColorList.bodyBackground,
                ...shadower(1)
            }}>
                <TouchableOpacity onPress={() => this.toggleList(isAll)} style={{
                    ...rounder(25, ColorList.bodyDarkWhite),
                    justifyContent: 'center',
                }}>
                    <AntDesign
                        style={{
                            ...GState.defaultIconSize,
                            color: ColorList.likeActive,
                            fontSize: 18,
                        }} name={isAll ? "upcircle" : "downcircle"} >

                    </AntDesign>
                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    }
}