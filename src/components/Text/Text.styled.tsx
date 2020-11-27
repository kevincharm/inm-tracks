import styled from '../../themes/lib/styled'

export const StyledParagraph = styled('p')((props) => ({
    lineHeight: 1.5,
    fontSize: props.theme.metrics.font.size.body,
    fontWeight: props.theme.metrics.font.weight.body,
}))

export const StyledHeading = styled('h2')((props) => ({
    marginTop: 0,
    fontSize: props.theme.metrics.font.size.heading,
    fontWeight: props.theme.metrics.font.weight.heading,
}))

export const StyledSubheading = styled('h3')((props) => ({
    marginTop: 0,
    fontSize: props.theme.metrics.font.size.subheading,
    fontWeight: props.theme.metrics.font.weight.subheading,
}))
