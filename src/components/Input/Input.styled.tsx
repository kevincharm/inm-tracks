import styled from '../../themes/lib/styled'

export const StyledLabel = styled('label')((props) => ({
    display: 'block',
    marginBottom: props.theme.metrics.margins.sm,
    letterSpacing: 1.5,
    color: props.theme.colours.fgLight,
    fontSize: props.theme.metrics.font.size.label,
    fontWeight: props.theme.metrics.font.weight.label,
}))

export const StyledInput = styled('input')((props) => ({
    '::placeholder': {
        color: props.theme.colours.fgLight,
    },
    fontSize: props.theme.metrics.font.size.body,
    fontWeight: props.theme.metrics.font.weight.body,
    marginBottom: props.theme.metrics.margins.md,
    padding: props.theme.metrics.margins.md,
    backgroundColor: props.theme.colours.fieldBg,
    borderStyle: 'solid',
    borderColor: props.theme.colours.fieldBorder,
    borderWidth: 1,
    borderRadius: 3,
    display: 'block',
    width: '100%',
}))
