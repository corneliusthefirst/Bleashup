import React, { PureComponent } from 'react';

import { TouchableOpacity, View, TouchableWithoutFeedback } from "react-native"
import ProfileView from '../../invitations/components/ProfileView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GState from '../../../../stores/globalState';
import ColorList from '../../../colorList';

export default class ProfileWithCheckBox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            hide: false
        }
    }
    componentDidMount() {
    
    }
    margin = { marginTop: 'auto', marginBottom: 'auto', }
    render() {
        return this.state.hide ? null : (
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                if (this.props.checked) {
                    this.props.uncheck(this.props.phone)
                } else {
                    this.props.check(this.props.phone)
                }
            })
            }>
                <View style={{ display: 'flex', flexDirection: 'row',justifyContent: 'space-between',marginTop: '1%', marginBottom: '5%',alignSelf: 'center',}}>
                <View style={{...this.margin,width:"10%"}}>
                    <MaterialIcons style={{...GState.defaultIconSize, color: ColorList.indicatorColor }} name={this.props.checked ? "radio-button-checked" :
                        "radio-button-unchecked"} type="MaterialIcons">
                        </MaterialIcons>
                    </View>
                    <View style={{...this.margin,width:'90%'}}>
                        <ProfileView searchString={this.props.searchString} delay={this.props.delay} hideMe={() => {
                            this.setState({ hide: true })
                        }} phone={this.props.phone}></ProfileView>
                    </View>
                </View>
            </TouchableOpacity>)
    }
}