import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  Clipboard,
  StyleSheet,
  Text,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import openLink from "../event/createEvent/components/openLinkOnBrowser";
import ColorList from "../../colorList";
import Toaster from "../../../services/Toaster";
import Vibrator from "../../../services/Vibrator";
import rounder from "../../../services/rounder";
import BeComponent from '../../BeComponent';
import ProfileModal from '../invitations/components/ProfileModal';
export default class TextContent extends BeComponent {
  constructor(props) {
    super(props);
    this.state = {
      splicer: 500,
      notShowingAll: true,
    };
    this.hideContact = this.hideContact.bind(this)
  }
  handleUrlPress(url, matchIndex /*: number*/) {
    openLink(url);
  }
  copyToClipboard(phone) {
    Clipboard.setString(phone);
    Vibrator.vibrateShort();
    Toaster({ text: "copied to clipboard !" });
  }

  handlePhonePress(phone, matchIndex /*: number*/) {
    this.copyToClipboard(phone);
  }

  handleNamePress(name, matchIndex /*: number*/) {
    let phone = this.props.tags.find(ele => ele.nickname == name)
    this.showContact(phone)

  }
  puncBod = /\*([\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~].*?|.*?)\*/i
  puncItalic = /\_([\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~].*?|.*?)\_/i
  puncStrick = /\~([\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~].*?|.*?)\~/i
  handleEmailPress(email, matchIndex /*: number*/) {
    this.copyToClipboard(email);
  }
  showContact(phone) {
    console.warn("hpone: ", phone)
    this.setStatePure({
      showContacts: true,
      profile: phone
    })
  }
  hideContact() {
    this.setStatePure({
      showContacts: false
    })
  }
  renderText(matchingString, matches) {
    // matches => ["[@michel:5455345]", "@michel", "5455345"]
    let pattern = /\[(@[^:]+):([^\]]+)\]/i;
    let match = matchingString.match(pattern);
    return `^^${match[1]}^^`;
  }
  fontSizeFormular() {
    let text = this.props.text || this.props.children
    return text && this.testForImoji(text) ? 100 : 16;
  }
  emoji_regex = /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/;
  imojiRexp = /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu;
  testForImoji(message) {
    let imoji = message.match(this.imojiRexp);
    return imoji && imoji.length == 1 && message.length == imoji[0].length;
  }
  renderBoldText(text) {
    return this.removeMatch(text, "*");
  }
  removeMatch(text, match) {
    return text.split(match)[1];
  }
  renderItalicText(text) {
    return this.removeMatch(text, "_");
  }
  renderStrickenText(text) {
    return this.removeMatch(text, "~");
  }
  String_toRegExp(pattern, flags) {
    return new RegExp(pattern, "i");
  }
  showAll() {
    this.props.animate && this.props.animate()
    this.setState({
      notShowingAll: !this.state.notShowingAll,
    })
  }
  render() {
    //console.warn(this.props.text.length,this.props.text)
    let text = this.props.text || this.props.children
    return (
      <TouchableOpacity
        onLongPress={() =>
          this.props.handleLongPress ? this.props.handleLongPress() : null
        }
        onPressIn={() => {
          this.props.pressingIn ? this.props.pressingIn() : null;
        }}
        onPress={() =>
          this.props.onPress
            ? requestAnimationFrame(() => {
              this.props.onPress()
            })
            : this.showAll()
        }
      >
        <View>
          <ParsedText
            style={
              this.props.style || {
                justifyContent: "center",
                fontSize: this.fontSizeFormular(),
                color: ColorList.bodyIcon,
                ...this.props.style,
                //backgroundColor: this.state.sender ? '#FFBFB2' : '#C1FFF2',
              }
            }
            adjustsFontSizeToFit={this.props.adjustsFontSizeToFit}
            ellipsizeMode={this.state.notShowingAll ? "tail" : null}
            numberOfLines={
              this.state.notShowingAll ? this.props.numberOfLines || 25 : null
            }
            parse={[
              ...(this.props.foundString
                ? [
                  {
                    pattern: this.String_toRegExp(this.props.foundString),
                    style: styles.textMatchFound,
                  },
                ]
                : []),
              ...(this.props.searchString
                ? [
                  {
                    pattern: this.String_toRegExp(this.props.searchString),
                    style: styles.textMatch,
                  },
                ]
                : []),
              {
                type: "url",
                style: styles.url,
                onPress: this.handleUrlPress.bind(this),
              },
              {
                type: "phone",
                style: styles.phone,
                onPress: this.handlePhonePress.bind(this),
              },
              {
                type: "email",
                style: styles.email,
                onPress: this.handleEmailPress.bind(this),
              },
              this.props.tags
                ? {
                  pattern: this.String_toRegExp(
                    this.props.tags.map((ele) => ele && ele.nickname).join("|")
                  ),
                  style: styles.name,
                  onPress: this.handleNamePress.bind(this),
                }
                : {
                  pattern: /\[(@[^:]+):([^\]]+)\]/i,
                  style: styles.username,
                  onPress: this.handleNamePress.bind(this),
                  renderText: this.renderText,
                },
              {
                pattern: /^\d+$/,
                style: styles.phone,
                onPress: this.handlePhonePress.bind(this),
              },
              {
                pattern: this.puncStrick,
                style: styles.strikesText,
                renderText: this.renderStrickenText.bind(this),
              },
              {
                pattern: this.puncItalic,
                style: styles.italicStyle,
                renderText: this.renderItalicText.bind(this),
              },
              {
                pattern: this.puncBod,
                style: styles.boldText,
                renderText: this.renderBoldText.bind(this),
              },
              { pattern: /#(\w+)/, style: styles.hashTag },
              ...(this.props.notScallEmoji
                ? []
                : [{ pattern: this.emoji_regex, style: styles.emoji_only }]),
              ...(this.props.notScallEmoji
                ? []
                : [{ pattern: this.imojiRexp, style: styles.imoji }]),
            ]}
            childrenProps={{ allowFontScaling: true }}
          >
            {text}
          </ParsedText>
        </View>
        {this.state.showContacts ? <ProfileModal
          isOpen={this.state.showContacts}
          onClosed={this.hideContact}
          profile={this.state.profile}>
        </ProfileModal> : null}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  italicStyle: {
    fontStyle: "italic",
  },
  strikesText: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  boldText: {
    fontWeight: "600",
  },
  url: {
    color: ColorList.iconActive,
    textDecorationLine: "underline",
  },

  email: {
    textDecorationLine: "underline",
  },
  imoji: {
    fontSize: 25,
    //backgroundColor: ColorList.bodyTextdark,
  },
  emoji_only: {
    fontSize: 60,
    textAlign: 'center'
  },
  text: {
    color: "black",
    fontSize: 15,
  },

  phone: {
    color: ColorList.indicatorColor,
    textDecorationLine: "underline",
  },
  textMatch: {
    backgroundColor: ColorList.iconInactive,
    fontWeight: "bold",
    fontStyle: "italic",
    color: ColorList.bodyBackground,
  },
  textMatchFound: {
    backgroundColor: ColorList.reminds,
    fontWeight: "bold",
    fontStyle: "italic",
    color: ColorList.bodyBackground,
  },
  name: {
    color: ColorList.likeInactive,
    fontWeight: "bold",
    fontStyle: "italic",
  },

  username: {
    color: "green",
    fontWeight: "bold",
  },

  magicNumber: {
    fontSize: 42,
    color: "pink",
  },

  hashTag: {
    fontStyle: "italic",
    color: "grey",
  },
});
