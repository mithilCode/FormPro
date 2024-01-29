import { FC } from 'react';

// third-party
import { OptionsObject, useSnackbar } from 'notistack'; // WithSnackbarProps

interface IProps {
	setUseSnackbarRef: (showSnackbar: any) => void; //WithSnackbarProps
}

const InnerSnackbarUtilsConfigurator: FC<IProps> = (props: IProps) => {
	props.setUseSnackbarRef(useSnackbar());
	return null;
};

let useSnackbarRef: any; //WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: any) => {
	//WithSnackbarProps
	useSnackbarRef = useSnackbarRefProp;
};

export const SnackbarUtilsConfigurator = () => {
	return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />;
};

export default function toast(msg: string, options: OptionsObject = {}) {
	useSnackbarRef.enqueueSnackbar(msg, options);
}
