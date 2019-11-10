import React, { Component } from 'react';
import Modal from "react-native-modalbox"
import { Button, Container, Text, Item, Input, Icon } from 'native-base';
import globalState from '../../../../stores/globalState/globalState';
import styles from "./styles"
export default class VerificationModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            code : null
        }
    }
    state = {}
    removeError() {
        globalState.error = false;
    }
    onChangedCode(value){
        this.setState({
            code:value
        })
    }
    verifyNumber(){
        this.props.verifyCode(this.state.code)
    }
    render() {
        return (
            <Modal isOpen={this.props.isOpened} position={"center"} swipeToClose={false} backdrop={false}>
                <Container>
                    <Button
                        transparent
                        regular
                        style={{ marginBottom: -22, marginTop: 50, marginLeft: -12 }}
                    >
                        <Text>Phone Number Verification {"    "}{this.props.phone.replace("00", "+")} </Text>
                    </Button>

                    <Text style={{ color: "skyblue", marginTop: 20 }}>
                        Please Comfirm your Account; A verification Code was sent to your number
          </Text>

                    <Item rounded style={styles.input}  error={globalState.error}>
                        <Icon active type="Ionicons" name="md-code" />
                        <Input
                            placeholder={
                                globalState.error == false
                                    ? "Please enter email verification code"
                                    : "Invalid email Verification code"
                            }
                            keyboardType="number-pad"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="go"
                            inverse
                            last
                            onChangeText={value => this.onChangedCode(value)}
                        />
                        {globalState.error == false ? (
                            <Text />
                        ) : (
                                <Icon
                                    onPress={this.removeError}
                                    type="Ionicons"
                                    name="close-circle"
                                    style={{ color: "#00C497" }}
                                />
                            )}
                    </Item>
                    <Button
                        block
                        rounded
                        style={styles.buttonstyle}
                        onPress={() => this.verifyNumber()}
                    >
                        {this.state.loading ? (
                            <Spinner color="#FEFFDE" />
                        ) : (
                                <Text> Ok </Text>
                            )}
                    </Button>
                </Container>
            </Modal>
        );
    }
}