import React, { Component } from "react";
import Modal from "react-native-modalbox";
import {
    View,
    TextInput,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { Text, Item, Button, Icon, Content } from "native-base";
import Textarea from "react-native-textarea";
import labler from "./labler";
import shadower from "../../shadower";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { format } from "../../../services/recurrenceConfigs";
import stores from "../../../stores";
import { isEqual } from "lodash";
import request from "../../../services/requestObjects";
import BleashupModal from "../../mainComponents/BleashupModal";
import CreationHeader from "../event/createEvent/components/CreationHeader";
import ColorList from "../../colorList";
import PickersUpload from "../event/createEvent/components/PickerUpload";
import VoteOptionPreviwer from "./VoteOptionMediaPreviewer";
import CreateButton from "../event/createEvent/components/ActionButton";
import CreateTextInput from "../event/createEvent/components/CreateTextInput";

let { height, width } = Dimensions.get("window");
export default class VoteCreation extends BleashupModal {
    initialize() {
        this.state = {
            vote: this.emptyVote,
            vote_id: "",
        };
    }
    emptyVote = {
        title: "",
        always_show: false,
        published: "public",
        description: "",
        period: null,
        option: ["yes", "no"],
    };
    componentDidMount() {
        //if (!this.props.update) {
        if (this.props.update) {
            this.setState({
                vote: this.props.vote,
            });
        } else {
            this.setState({
                vote_id: this.props.vote_id,
            });
        }
        //  }
    }
    renderOptions() {
        return (
            this.state.vote &&
            this.state.vote.option.map((item, index) => this.Itemer(index))
        );
    }
    setOption(value, index) {
        let options = this.state.vote.option;
        options[index] = { ...options[index], name: value, index, vote_count: 0 };
        this.setState({
            vote: { ...this.state.vote, option: options },
        });
        this.updateVoteOtions(options);
    }
    setOptionURL(value, index) {
        let options = this.state.vote.option;
        options[index] = {
            ...options[index],
            option_url: value,
            index,
            vote_count: 0,
        };
        this.setState({
            vote: { ...this.state.vote, option: options },
        });
        this.updateVoteOtions(options);
    }
    updateVoteOtions(options) {
        if (!this.props.update) {
            stores.Votes.updateVoteOptions(this.props.committee_id, {
                vote_id: this.state.vote.id,
                new_option: options,
            }).then(() => { });
        }
    }
    initializeVote() {
        stores.Votes.loadVote(this.props.committee_id, request.Vote().id).then(
            (vote) => {
                console.warn(this.props.committee_id, vote);
                this.setState({
                    vote: !vote ? request.Vote() : vote,
                });
            }
        );
    }
    previousVote = JSON.stringify({ name: "" });
    componentDidUpdate(prevProps, prevState, contex) {
        if (this.props.update !== prevProps.update && !this.props.update) {
            this.initializeVote();
        }
        if (!this.props.update) {
            if (
                this.state.vote &&
                prevState.vote &&
                this.state.vote.title !== prevState.vote.title
            ) {
                stores.Votes.updateVoteTitle(this.props.committee_id, {
                    new_title: this.state.vote.title,
                    vote_id: this.state.vote.id,
                }).then(() => { });
            }
            if (
                this.state.vote &&
                prevState.vote &&
                this.state.vote.description !== prevState.vote.description
            ) {
                stores.Votes.UpdateVoteDescription(this.props.committee_id, {
                    new_description: this.state.vote.description,
                    vote_id: this.state.vote.id,
                }).then(() => { });
            }
            if (
                this.state.vote &&
                prevState.vote &&
                this.state.vote.published !== prevState.vote.published
            ) {
                stores.Votes.PublishVote(this.props.committee_id, {
                    vote_id: this.state.vote.id,
                    new_public_state: this.state.vote.published,
                }).then(() => { });
            }
            if (
                this.state.vote &&
                prevState.vote &&
                this.state.vote.period !== prevState.vote.period
            ) {
                stores.Votes.UpdateVotePeriod(this.props.committee_id, {
                    period: this.state.vote.period,
                    vote_id: this.state.vote.id,
                }).then(() => { });
            }
            if (
                this.state.vote &&
                prevState.vote &&
                this.state.vote.always_show !== prevState.vote.always_show
            ) {
                stores.Votes.updateAlwayShowPercentage(this.props.committee_id, {
                    vote_id: this.state.vote.id,
                    new_always_show: this.state.vote.always_show,
                }).then(() => { });
            }
            if (
                this.props.vote_id !== prevProps.vote_id ||
                this.state.vote_id !== prevState.vote_id
            ) {
                this.initializeVote();
            }
        } else {
            if (!isEqual(JSON.parse(this.previousVote), this.props.vote)) {
                this.setState({
                    vote: this.props.vote,
                });
                this.previousVote = JSON.stringify(this.props.vote);
            }
        }
    }
    removeNote(index) {
        this.state.vote.option.splice(index, 1);
        let options = this.state.vote.option;
        this.setState({
            vote: { ...this.state.vote, option: options },
            showVoteOptionError: options.length <= 1 ? true : false,
        });
        this.updateVoteOtions(options);
    }
    Itemer(index) {
        return (
            <View style={{ flexDirection: "row" }}>
                <Text
                    style={{
                        fontWeight: "bold",
                        color: "#1FABAB",
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}
                >{`${labler(index)} .`}</Text>
                <TextInput
                    placeholder={"enter option name here"}
                    value={this.state.vote && this.state.vote.option[index].name}
                    onChangeText={(val) => this.setOption(val, index)}
                    style={{ width: "40%" }}
                ></TextInput>
                <View
                    style={{
                        width: "40%",
                        justifyContent: "center",
                        marginBottom: "auto",
                        marginTop: "auto",
                        flexDirection: "row",
                    }}
                >
                    <PickersUpload
                        currentURL={
                            (this.state.vote && this.state.vote.option[index].option_url) ||
                            {}
                        }
                        saveMedia={(option_url) => {
                            this.setOptionURL(option_url, index);
                        }}
                        creating
                        notAudio
                    ></PickersUpload>
                    <View style={{ marginTop: "3%" }}>
                        <VoteOptionPreviwer
                            trashable
                            optionName={this.state.vote && this.state.vote.option[index].name}
                            cleanMedia={() => {
                                this.setOptionURL(null, index);
                            }}
                            url={this.state.vote && this.state.vote.option[index].option_url}
                        ></VoteOptionPreviwer>
                    </View>
                </View>
                <View style={{ width: "15%", justifyContent: "center" }}>
                    <Icon
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => this.removeNote(index)}
                        name="minus"
                        type="EvilIcons"
                    ></Icon>
                </View>
            </View>
        );
    }
    showVoteOptionError() {
        this.setState({
            showVoteOptionError: true,
        });
    }
    showVoteContentError() {
        this.setState({
            showVoteContentError: true,
        });
    }
    showMustSpecifyVotePeriodError() {
        this.setState({
            nowVotePeriod: true,
        });
    }
    addVote() {
        let vote = this.state.vote;
        if (vote.option.length <= 1) {
            this.showVoteOptionError();
        } else if (!vote.description && !vote.title) {
            this.showVoteContentError();
        }
        if (!vote.period) {
            this.showMustSpecifyVotePeriodError();
        } else {
            this.props.takeVote({ ...vote, voter: [] });
        }
    }
    changeAlwaysShowState() {
        this.setState({
            vote: { ...this.state.vote, always_show: !this.state.vote.always_show },
        });
    }
    addOptions() {
        let options = this.state.vote.option.map((ele) => {
            return {
                ...ele,
                index: ele.index + 1,
            };
        });
        options.unshift({ name: "", index: 0, vote_count: 0 });
        this.setState({
            vote: {
                ...this.state.vote,
                option: options,
            },
            showVoteOptionError: options.length <= 1 ? true : false,
            //newThing: !this.state.newThing
        });
        this.updateVoteOtions(options);
    }
    changeEndTime(e, date) {
        if (date === undefined) {
            this.setState({
                showDatePicker: false,
            });
        } else {
            let newDate = moment(date).format().split("T")[0];
            let newTime = this.state.vote.period
                ? moment(this.state.vote.period).format().split("T")[1]
                : moment()
                    .startOf("day")
                    .add(moment.duration(1, "hours"))
                    .toISOString()
                    .split("T")[1];
            let newDateTime = newDate + "T" + newTime;
            this.setState({
                nowVotePeriod: false,
                vote: { ...this.state.vote, period: newDateTime },
                showDatePicker: false,
                showTimePicker: true,
            });
        }
    }
    changeTime(e, date) {
        if (date === undefined) {
            this.setState({
                showTimePicker: false,
            });
        } else {
            let newTime = moment(date).format().split("T")[1];
            let newDate = this.state.vote.period
                ? moment(this.state.vote.period).format().split("T")[0]
                : moment().format().split("T")[0];
            this.setState({
                nowVotePeriod: false,
                showTimePicker: false,
                vote: { ...this.state.vote, period: newDate + "T" + newTime },
                //newThing: !this.state.newThing
            });
        }
    }
    updateVote() {
        this.props.updateVote(this.previousVote, this.state.vote);
    }
    width = "90%";
    onClosedModal() {
        this.props.onClosed();
    }
    entry = "top";
    state = {};
    swipeToClose = false;
    modalBody() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView 
                keyboardShouldPersistTaps={'handled'} 
                showsVerticalScrollIndicator={false}>
                    <View
                        style={{
                            height: "100%",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                        }}
                    >
                        <CreationHeader
                            title={!this.props.update ? "new vote" : "update vote"}
                            extra={
                                this.props.update ? (
                                    <View
                                        style={{
                                            width: "65%",
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                        }}
                                    >
                                        <Text
                                            note
                                            style={{
                                                fontWeight: "bold",
                                                color: "#555756",
                                            }}
                                        >
                                            {"only the voting end date is updated"}
                                        </Text>
                                    </View>
                                ) : null
                            }
                            back={this.onClosedModal.bind(this)}
                        ></CreationHeader>
                        <View
                            style={{
                                height:
                                    ColorList.containerHeight - (ColorList.headerHeight + 20),
                            }}
                        >
                            <ScrollView
                                keyboardShouldPersistTaps={'handled'}
                                showsVerticalScrollIndicator={false}
                                style={{ height: "100%" }}
                            >
                                <View style={{ width: this.width, alignSelf: "center" }}>
                                    {this.state.showVoteContentError ? (
                                        <Text style={{ color: "#A91A84", fontWeight: "bold" }} note>
                                            {"vote should at least have a title or a detail"}
                                        </Text>
                                    ) : null}
                                    {this.state.showVoteOptionError ? (
                                        <Text style={{ color: "#A91A84", fontWeight: "bold" }} note>
                                            {"vote should have at least a 2 options"}
                                        </Text>
                                    ) : null}
                                    {this.state.nowVotePeriod ? (
                                        <Text style={{ color: "#A91A84", fontWeight: "bold" }} note>
                                            {"you must specify the voting endate"}
                                        </Text>
                                    ) : null}
                                    <View
                                        style={{
                                            height: height / 14,
                                            alignItems: "center",
                                            margin: "2%",
                                            width: "90%",
                                            alignSelf: "center",
                                        }}
                                    >
                                        <CreateTextInput
                                            maxLength={70}
                                            height={height / 14}
                                            value={
                                                this.state.vote && this.state.vote.title
                                                    ? this.state.vote.title
                                                    : ""
                                            }
                                            placeholder={"vote"}
                                            onChange={(text) => {
                                                this.setState({
                                                    vote: { ...this.state.vote, title: text },
                                                    showVoteContentError:
                                                        (!text || text.length <= 0) &&
                                                            this.state.vote &&
                                                            !this.state.vote.description
                                                            ? true
                                                            : false,
                                                });
                                            }}
                                        ></CreateTextInput>
                                    </View>
                                    <View style={{ width: this.width, alignSelf: "center" }}>
                                        <CreateTextInput
                                            height={150}
                                            maxLength={1000}
                                            multiline
                                            numberOfLines={30}
                                            placeholder="details"
                                            value={this.state.vote && this.state.vote.description}
                                            onChange={(value) => {
                                                this.setState({
                                                    vote: { ...this.state.vote, description: value },
                                                    showVoteContentError:
                                                        (!value || value.length <= 0) &&
                                                            !this.state.vote.title
                                                            ? true
                                                            : false,
                                                });
                                            }}
                                        />
                                    </View>
                                    <Button
                                        onPress={() => this.changeAlwaysShowState()}
                                        transparent
                                    >
                                        <Icon
                                            name={
                                                this.state.vote && this.state.vote.always_show
                                                    ? "radio-button-checked"
                                                    : "radio-button-unchecked"
                                            }
                                            type={"MaterialIcons"}
                                        ></Icon>
                                        <Text>{"always show vote percentages"}</Text>
                                    </Button>
                                    <View style={{ width: this.width }}>
                                        <Button
                                            onPress={() => {
                                                this.setState({
                                                    showDatePicker: true,
                                                });
                                            }}
                                            transparent
                                        >
                                            <Text style={{ fontWeight: "bold" }}>{"Ends: "}</Text>
                                            <Text>
                                                {this.state.vote && this.state.vote.period
                                                    ? moment(this.state.vote.period).format(format)
                                                    : "select voting end date"}
                                            </Text>
                                        </Button>
                                    </View>
                                    {this.state.showDatePicker ? (
                                        <DateTimePicker
                                            value={
                                                this.state.vote && this.state.period
                                                    ? parseFloat(
                                                        moment(this.state.vote.period).format("x")
                                                    )
                                                    : new Date()
                                            }
                                            is24Hour={true}
                                            mode={"default"}
                                            onChange={(e, date) => this.changeEndTime(e, date)}
                                        ></DateTimePicker>
                                    ) : null}
                                    {this.state.showTimePicker ? (
                                        <DateTimePicker
                                            display={"clock"}
                                            value={
                                                this.state.vote && this.state.period
                                                    ? parseFloat(
                                                        moment(this.state.vote.period).format("x")
                                                    )
                                                    : new Date()
                                            }
                                            onChange={(e, date) => this.changeTime(e, date)}
                                            mode={"time"}
                                            is24Hour={true}
                                        ></DateTimePicker>
                                    ) : null}
                                    <View style={{ flexDirection: "column" }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Button onPress={() => this.addOptions()} transparent>
                                                <Text
                                                    style={{ fontWeight: "bold", fontStyle: "italic" }}
                                                >
                                                    {"Options"}
                                                </Text>
                                                <Icon name="pluscircle" type={"AntDesign"}></Icon>
                                            </Button>
                                        </View>
                                        <View style={{ marginLeft: "2%" }}>
                                            {this.renderOptions()}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            marginTop: "4%",
                                        }}
                                    >
                                        <View style={{ width: "80%" }}></View>
                                        <View style={{ width: "20%", marginBottom: "10%" }}>
                                            <CreateButton
                                                title={this.props.update ? "update" : "add"}
                                                action={() =>
                                                    this.props.update ? this.updateVote() : this.addVote()
                                                }
                                            ></CreateButton>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}
