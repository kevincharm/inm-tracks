import colours from './lib/colours'

const defaultTheme = {
    colours: {
        fg: colours.blueGrey900,
        fgLight: colours.blueGrey500,
        bg: colours.white,
        bgDark: colours.blueGrey50,
        linkFg: colours.blue600,
        /** Background of input fields */
        fieldBg: '#fafafa',
        fieldBorder: '#dedede',
        dropShadow: '#dedede',
        // loadingBarGradientOuter: '#FF4E50',
        // loadingBarGradientInner: '#F9D423',
        loadingBarGradientOuter: '#fc67fa',
        loadingBarGradientInner: '#f4c4f3',
        toolbarTitleBg: colours.blueGrey100,
        toolbarTitleFg: colours.blueGrey900,
        primary: {
            bg: colours.coolBlue,
            fg: colours.white,
        },
        positive: {
            bg: colours.green500,
            fg: colours.white,
        },
        danger: {
            bg: colours.red500,
            fg: colours.white,
        },
        disabled: {
            bg: colours.blueGrey200,
            fg: colours.white,
        },
    },
    metrics: {
        navBarHeight: 64,
        errorDisplayHeight: 48,
        font: {
            size: {
                label: 12,
                body: 16,
                errorDisplay: 16,
                heading: 28,
                subheading: 22,
                button: 14,
                navItem: 16,
                toolbarTitle: 12,
            },
            weight: {
                label: 8,
                body: 300,
                errorDisplay: 500,
                subheading: 300,
                heading: 300,
                button: 500,
                navItem: 500,
            },
        },
        margins: {
            sm: 8,
            md: 16,
            lg: 32,
        },
    },
}

export type Theme = typeof defaultTheme

export default defaultTheme
