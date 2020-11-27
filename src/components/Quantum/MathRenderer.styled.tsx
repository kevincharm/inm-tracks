import styled from '@emotion/styled'

export const StyledContainer = styled('div')({
    fontFamily: 'Montserrat',
    fontWeight: 300,
    fontSize: 16,

    hr: {
        border: 'none',
        borderTopWidth: 1,
        borderTopStyle: 'dashed',
        borderTopColor: '#d8dee9',
    },

    pre: {
        fontFamily: 'KaTeX_Main',
        fontSize: 18,
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#2e344077',
    },

    strong: {
        fontWeight: 600,
    },
})
