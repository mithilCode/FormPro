import { common } from './common';
import { master } from './master';
import { message } from './message';
import { title } from './title';
import { user } from './user';

const ro_RO = {
	...common,
	...master,
	...message,
	...title,
	...user
};

export default ro_RO;
