import { common } from './common';
import { master } from './master';
import { message } from './message';
import { title } from './title';
import { user } from './user';

const zh_ZH = {
	...common,
	...master,
	...message,
	...title,
	...user
};

export default zh_ZH;
