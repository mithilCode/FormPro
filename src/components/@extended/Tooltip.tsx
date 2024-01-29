// material-ui
import { Box, Tooltip as MuiTooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';

// type
import { ColorProps } from 'types/extended';

// project import
import getColors from '@utils/getColors';

// ==============================|| TOOLTIP - VARIANT ||============================== //

interface TooltipStyleProps {
	color?: ColorProps | string;
	labelColor?: ColorProps | string;
	theme: Theme;
}

function getVariantStyle({ color, theme, labelColor }: TooltipStyleProps) {
	const colors = getColors(theme, color as ColorProps);
	const { main, contrastText } = colors;
	const colorValue = color ? color : '';

	if (['primary', 'secondary', 'info', 'success', 'warning', 'error'].includes(colorValue)) {
		return {
			[`& .${tooltipClasses.tooltip}`]: {
				backgroundColor: main,
				color: labelColor ? labelColor : contrastText
			},
			[`& .${tooltipClasses.arrow}`]: {
				color: main
			}
		};
	} else {
		return {
			[`& .${tooltipClasses.tooltip}`]: {
				backgroundColor: colorValue,
				color: labelColor ? labelColor : contrastText,
				boxShadow: theme.shadows[1]
			},
			[`& .${tooltipClasses.arrow}`]: {
				color: colorValue
			}
		};
	}
}

// ==============================|| STYLED - TOOLTIP COLOR ||============================== //

interface StyleProps {
	theme: Theme;
	arrow: TooltipProps['arrow'];
	labelColor?: ColorProps | string;
	color?: ColorProps | string;
}

const TooltipStyle = styled(
	({ className, ...props }: TooltipProps) => (
		<MuiTooltip {...props} classes={{ popper: className }} />
	),
	{
		shouldForwardProp: (prop: any) => prop !== 'color' && prop !== 'labelColor'
	}
)(({ theme, color, labelColor }: StyleProps) => ({
	...(color && getVariantStyle({ color, theme, labelColor }))
}));

// ==============================|| EXTENDED - TOOLTIP ||============================== //

interface Props extends TooltipProps {
	color?: ColorProps | string;
	labelColor?: ColorProps | string;
	children: TooltipProps['children'];
}

export default function CustomTooltip({ children, arrow, labelColor = '', ...rest }: Props) {
	const theme = useTheme();
	return (
		<Box display="flex">
			<TooltipStyle arrow={arrow} {...rest} theme={theme} labelColor={labelColor}>
				{children}
			</TooltipStyle>
		</Box>
	);
}
