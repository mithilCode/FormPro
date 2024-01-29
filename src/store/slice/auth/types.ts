import { ReactElement } from 'react';

// third-party
// import firebase from 'firebase/compat/app';
import { KeyedObject } from 'types/root';

// ==============================|| AUTH TYPES  ||============================== //

export type GuardProps = {
	children: ReactElement | null;
};

export type UserProfile = {
	// id?: string;
	Email?: string;
	Avatar?: string;
	image?: string;
	name?: string;
	role?: string;
	tier?: string;
	FirstName?: string;
	LastName?: string;
	Name?: string;
	UserType?: string;
	MobileNumber?: string;
};

export interface AuthProps {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null;
	token?: string | null;
}

export interface ClientJSProps {
	AppType: string;
	Fingerprint: string | null;
	OS: string | null;
	Device: string | null;
}

// interface keyable {
// 	[key: string]: any;
// }

/* --- STATE --- */
export type authState = {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null;
	token?: string | null;
	loading?: boolean;
	apiSuccess?: KeyedObject | null;
	apiError?: KeyedObject | null;
};

export interface AuthActionProps {
	type: string;
	// payload?: AuthProps;
	payload?: authState;
}

// export type FirebaseContextType = {
// 	isLoggedIn: boolean;
// 	isInitialized?: boolean;
// 	user?: UserProfile | null | undefined;
// 	logout: () => Promise<void>;
// 	login: () => void;
// 	firebaseRegister: (email: string, password: string) => Promise<firebase.auth.UserCredential>;
// 	firebaseEmailPasswordSignIn: (
// 		email: string,
// 		password: string
// 	) => Promise<firebase.auth.UserCredential>;
// 	firebaseGoogleSignIn: () => Promise<firebase.auth.UserCredential>;
// 	firebaseTwitterSignIn: () => Promise<firebase.auth.UserCredential>;
// 	firebaseFacebookSignIn: () => Promise<firebase.auth.UserCredential>;
// 	resetPassword: (email: string) => Promise<void>;
// 	updateProfile: VoidFunction;
// };

// export type AWSCognitoContextType = {
// 	isLoggedIn: boolean;
// 	isInitialized?: boolean;
// 	user?: UserProfile | null | undefined;
// 	logout: () => void;
// 	login: (email: string, password: string) => Promise<void>;
// 	register: (
// 		email: string,
// 		password: string,
// 		firstName: string,
// 		lastName: string
// 	) => Promise<unknown>;
// 	resetPassword: (verificationCode: string, newPassword: string) => Promise<any>;
// 	forgotPassword: (email: string) => Promise<void>;
// 	updateProfile: VoidFunction;
// };

export interface InitialLoginContextProps {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
	userId: string;
}

export type JWTContextType = {
	isLoggedIn: boolean;
	isInitialized?: boolean;
	user?: UserProfile | null | undefined;
	login: (data: KeyedObject) => Promise<void>;
	logout: (redirect?: string) => void;
	register: (data: KeyedObject) => Promise<void>;
	resetPassword: (email: string) => Promise<void>;
	updateProfile: (data: KeyedObject) => Promise<void>;
	submitLogin: (data: KeyedObject) => Promise<void>;
};

// export type Auth0ContextType = {
// 	isLoggedIn: boolean;
// 	isInitialized?: boolean;
// 	user?: UserProfile | null | undefined;
// 	logout: () => void;
// 	login: () => void;
// 	resetPassword: (email: string) => Promise<void>;
// 	updateProfile: VoidFunction;
// };

export type ContainerState = authState;