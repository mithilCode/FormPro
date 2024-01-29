/* --- STATE --- */
export interface globalState {
	loading: boolean;
	theme?: string;
	layout?: any;
	// declare what you want in your Auth state
}

/* 
  If you want to use 'ContainerState' keyword everywhere in your current folder, 
  instead of the 'globalState' keyword.
*/
export type ContainerState = globalState;
