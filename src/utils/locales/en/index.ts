import { common } from './common';
import { master } from './master';
import { message } from './message';
import { title } from './title';
import { user } from './user';

const en_US = {
	...common,
	...master,
	...message,
	...title,
	...user
};

export default en_US;
