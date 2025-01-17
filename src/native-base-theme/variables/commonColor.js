// @flow

import color from "color";

import {
    Platform,
    Dimensions,
    PixelRatio
} from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
    platform === "ios" &&
    (deviceHeight === 812 ||
        deviceWidth === 812 ||
        deviceHeight === 896 ||
        deviceWidth === 896);

export default {
    platformStyle,
    platform,

    //Accordion
    headerStyle: "#edebed",
    iconStyle: "#000",
    contentStyle: "#f5f4f5",
    expandedIconStyle: "#000",
    accordionBorderColor: "#d3d3d3",

    //Android
    androidRipple: true,
    androidRippleColor: "rgba(256, 256, 256, 0.3)",
    androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
    btnUppercaseAndroidText: true,

    // Badge
    badgeBg: "#ED1727",
    badgeColor: "#FEFFDE",
    badgePadding: platform === "ios" ? 3 : 0,

    // Button
    btnFontFamily: platform === "ios" ? "System" : "Roboto_medium",
    btnDisabledBg: "#b5b5b5",
    buttonPadding: 6,
    get btnPrimaryBg() {
        return this.brandPrimary;
    },
    get btnPrimaryColor() {
        return this.inverseTextColor;
    },
    get btnInfoBg() {
        return this.brandInfo;
    },
    get btnInfoColor() {
        return this.inverseTextColor;
    },
    get btnSuccessBg() {
        return this.brandSuccess;
    },
    get btnSuccessColor() {
        return this.inverseTextColor;
    },
    get btnDangerBg() {
        return this.brandDanger;
    },
    get btnDangerColor() {
        return this.inverseTextColor;
    },
    get btnWarningBg() {
        return this.brandWarning;
    },
    get btnWarningColor() {
        return this.inverseTextColor;
    },
    get btnTextSize() {
        return platform === "ios" ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
    },
    get btnTextSizeLarge() {
        return this.fontSizeBase * 1.5;
    },
    get btnTextSizeSmall() {
        return this.fontSizeBase * 0.8;
    },
    get borderRadiusLarge() {
        return this.fontSizeBase * 3.8;
    },
    get iconSizeLarge() {
        return this.iconFontSize * 1.5;
    },
    get iconSizeSmall() {
        return this.iconFontSize * 0.6;
    },

    // Card
    cardDefaultBg: "#FEFFDE",
    cardBorderColor: "#ccc",
    cardBorderRadius: 2,
    cardItemPadding: platform === "ios" ? 1 : 2,

    // CheckBox
    CheckboxRadius: platform === "ios" ? 13 : 0,
    CheckboxBorderWidth: platform === "ios" ? 1 : 2,
    CheckboxPaddingLeft: platform === "ios" ? 4 : 2,
    CheckboxPaddingBottom: platform === "ios" ? 0 : 5,
    CheckboxIconSize: platform === "ios" ? 21 : 16,
    CheckboxIconMarginTop: platform === "ios" ? undefined : 1,
    CheckboxFontSize: platform === "ios" ? 23 / 0.9 : 17,
    checkboxBgColor: "#1FABAB",
    checkboxSize: 20,
    checkboxTickColor: "#FEFFDE",

    // Color
    brandPrimary: platform === "ios" ? "#33BDBD" : "#1FABAB",
    brandInfo: "#62B1F6",
    brandSuccess: "#5cb85c",
    brandDanger: "#d9534f",
    brandWarning: "#f0ad4e",
    brandDark: "#000",
    brandLight: "#f4f4f4",

    //Container
    containerBgColor: "#FEFFDE",

    //Date Picker
    datePickerTextColor: "#000",
    datePickerBg: "transparent",

    // Font
    DefaultFontSize: 16,
    fontFamily: platform === "ios" ? "System" : "Roboto",
    fontSizeBase: 15,
    get fontSizeH1() {
        return this.fontSizeBase * 1.8;
    },
    get fontSizeH2() {
        return this.fontSizeBase * 1.6;
    },
    get fontSizeH3() {
        return this.fontSizeBase * 1.4;
    },

    // Footer
    footerHeight: 35,
    footerDefaultBg: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    footerPaddingBottom: 0,

    // FooterTab
    tabBarTextColor: platform === "ios" ? "#7DD2D2" : "#7DD2D2",
    tabBarTextSize: platform === "ios" ? 14 : 11,
    activeTab: platform === "ios" ? "#33BDBD" : "#FEFFDE",
    sTabBarActiveTextColor: "#33BDBD",
    tabBarActiveTextColor: platform === "ios" ? "#2874F0" : "#FEFFDE",
    tabActiveBgColor: platform === "ios" ? "#cde1f9" : "#1FABAB",

    // Header
    toolbarBtnColor: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    toolbarDefaultBg: platform === "ios" ? "#1FABAB" : "#1FABAB",
    toolbarHeight: platform === "ios" ? 64 : 56,
    toolbarSearchIconSize: platform === "ios" ? 20 : 23,
    toolbarInputColor: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    searchBarHeight: platform === "ios" ? 30 : 40,
    searchBarInputHeight: platform === "ios" ? 30 : 50,
    toolbarBtnTextColor: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    iosStatusbar: "dark-content",
    toolbarDefaultBorder: platform === "ios" ? "#1FABAB" : "#1FABAB",
    get statusBarColor() {
        return color(this.toolbarDefaultBg)
            .darken(0.2)
            .hex();
    },
    get darkenHeader() {
        return color(this.tabBgColor)
            .darken(0.03)
            .hex();
    },

    // Icon
    iconFamily: "EvilIcons",
    iconFontSize: platform === "ios" ? 30 : 28,
    iconHeaderSize: platform === "ios" ? 33 : 24,

    // InputGroup
    inputFontSize: 17,
    inputBorderColor: "#D9D5DC",
    inputSuccessBorderColor: "#2b8339",
    inputErrorBorderColor: "#ed2f2f",
    inputHeightBase: 50,
    get inputColor() {
        return this.textColor;
    },
    get inputColorPlaceholder() {
        return "#575757";
    },

    // Line Height
    btnLineHeight: 19,
    lineHeightH1: 32,
    lineHeightH2: 27,
    lineHeightH3: 22,
    lineHeight: platform === "ios" ? 20 : 24,

    // List
    listBg: "transparent",
    listBorderColor: "#c9c9c9",
    listDividerBg: "#f4f4f4",
    listBtnUnderlayColor: "#DDD",
    listItemPadding: platform === "ios" ? 10 : 12,
    listNoteColor: "#808080",
    listNoteSize: 13,
    listItemSelected: platform === "ios" ? "#33BDBD" : "#1FABAB",

    // Progress Bar
    defaultProgressColor: "#E4202D",
    inverseProgressColor: "#1A191B",

    // Radio Button
    radioBtnSize: platform === "ios" ? 25 : 23,
    radioSelectedColorAndroid: "#1FABAB",
    radioBtnLineHeight: platform === "ios" ? 29 : 24,
    get radioColor() {
        return this.brandPrimary;
    },

    // Segment
    segmentBackgroundColor: platform === "ios" ? "#1FABAB" : "#1FABAB",
    segmentActiveBackgroundColor: platform === "ios" ? "#33BDBD" : "#FEFFDE",
    segmentTextColor: platform === "ios" ? "#33BDBD" : "#FEFFDE",
    segmentActiveTextColor: platform === "ios" ? "#FEFFDE" : "#1FABAB",
    segmentBorderColor: platform === "ios" ? "#33BDBD" : "#FEFFDE",
    segmentBorderColorMain: platform === "ios" ? "#a7a6ab" : "#1FABAB",

    // Spinner
    defaultSpinnerColor: "#20B29E",
    inverseSpinnerColor: "#305455",

    // Tab
    tabDefaultBg: platform === "ios" ? "#1FABAB" : "#1FABAB",
    topTabBarTextColor: platform === "ios" ? "#7DD2D2" : "#7DD2D2",
    topTabBarActiveTextColor: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    topTabBarBorderColor: platform === "ios" ? "#FEFFDE" : "#FEFFDE",
    topTabBarActiveBorderColor: platform === "ios" ? "#33BDBD" : "#1FABAB",

    // Tabs
    tabBgColor: "#1FABAB",
    tabFontSize: 16,

    // Text
    textColor: "#0A4E52",
    inverseTextColor: "#053135",
    noteFontSize: 11,
    get defaultTextColor() {
        return this.textColor;
    },

    // Title
    titleFontfamily: platform === "ios" ? "System" : "Roboto_medium",
    titleFontSize: platform === "ios" ? 17 : 19,
    subTitleFontSize: platform === "ios" ? 11 : 14,
    subtitleColor: platform === "ios" ? "#000" : "#FEFFDE",
    titleFontColor: platform === "ios" ? "#000" : "#FEFFDE",

    // Other
    borderRadiusBase: platform === "ios" ? 5 : 2,
    borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    contentPadding: 10,
    dropdownLinkColor: "#414142",
    inputLineHeight: 24,
    deviceWidth,
    deviceHeight,
    isIphoneX,
    inputGroupRoundedBorderRadius: 30,

    //iPhoneX SafeArea
    Inset: {
        portrait: {
            topInset: 24,
            leftInset: 0,
            rightInset: 0,
            bottomInset: 34
        },
        landscape: {
            topInset: 0,
            leftInset: 44,
            rightInset: 44,
            bottomInset: 21
        }
    }
};
