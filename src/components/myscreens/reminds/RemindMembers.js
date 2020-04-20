import React, { Component } from "react";
import BleashupModal from "../../mainComponents/BleashupModal";
import ParticipantList from "../../ParticipantList";
import SelectableContactList from "../../SelectableContactList";
import { View } from 'react-native';

export default class RemindMembers extends BleashupModal {
    onClosedModal(){
        this.setState({
            selectMemberState: false
        })
        this.props.onClosed()
    }
    modalBody() {
        return (
            <View>
                <ParticipantList
                isSelecting={this.state.selectMemberState}
                close={() => {
                        this.onClosedModal()
                       
                }}
                    addMembers={() => {
                        this.setState({
                            selectMemberState: true,
                            adding: true,
                        });
                    }}
                    removeMember={() => {
                        this.setState({
                            selectMemberState: true,
                            adding: false,
                        });
                    }}
                    title={"Remind Concernee"}
                    participants={this.props.currentMembers}
                    creator={this.props.creator}
                managing></ParticipantList>
                <SelectableContactList
                    isOpen={this.state.selectMemberState}
                    close={() => {
                        this.setState({
                            selectMemberState: false,
                        });
                    }}
                    members={
                        this.state.adding
                            ? this.props.participants.filter(
                                (ele) =>
                                    this.props.currentMembers.findIndex(
                                        (e) => e.phone === ele.phone
                                    ) < 0
                            )
                            : this.props.currentMembers
                    }
                    notcheckall={!this.state.adding ? true : false}
                    takecheckedResult={(members) =>
                        this.state.adding
                            ? this.props.takecheckedResult([
                                ...members,
                                ...this.props.currentMembers,
                            ])
                            : this.props.takecheckedResult(
                                this.props.currentMembers.filter(
                                    (ele) => members.findIndex((e) => e.phone === ele.phone) < 0
                                )
                            )
                    }
                ></SelectableContactList>
            </View>
        );
    }
}
