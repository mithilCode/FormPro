import { FC, ReactElement } from 'react';
import { useIntl } from 'react-intl';
import { RouteProps } from 'react-router';

// import RequireAuth from '@app/routes/RequireAuth';

export type WrapperRouteProps = RouteProps & {
	/** document title locale id */
	titleId: string;
	// /** authorization？ */
	// auth?: boolean;
};

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ titleId, ...props }) => {
	const { formatMessage } = useIntl();

	// console.log('titleId', titleId, auth);
	// document.title = titleId;

	if (titleId) {
		document.title = formatMessage({
			id: titleId
		});
	}
	return props.element as ReactElement;
	// return auth ? <RequireAuth {...props} /> : (props.element as ReactElement);
};

export default WrapperRouteComponent;
