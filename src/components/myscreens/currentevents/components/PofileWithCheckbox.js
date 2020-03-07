import React, { PureComponent } from 'react';

import { TouchableOpacity, View } from "react-native"
import { Icon } from 'native-base';
import ProfileView from '../../invitations/components/ProfileView';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class ProfileWithCheckBox extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            hide: false
        }
    }
    componentDidMount() {
        this.setState({
            checked: this.props.checked
        })
    }
    render() {
        return this.state.hide ? null : (
            <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                if (this.state.checked == true) {
                    this.props.uncheck(this.props.phone)
                } else {
                    this.props.check(this.props.phone)
                }
                this.setState({
                    checked: !this.state.checked
                })
            })
            }>
                <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Icon style={{ marginTop: "5%", color: "#1FABAB" }} name={this.state.checked ? "radio-button-checked" :
                        "radio-button-unchecked"} type="MaterialIcons"></Icon>
                    <View style={{ margin: '2%', }}>
                        <ProfileView delay={this.props.delay} hideMe={() => {
                            this.setState({ hide: true })
                        }} phone={this.props.phone}></ProfileView>
                    </View>
                </View>
            </TouchableOpacity>)
    }
}