export interface User {
    username: string;
	email: string;
    token: string;
	firstName: string;
	lastName: string;
	id: string;
	clientId: string;
}


export interface UserFormValues {
    email: string;
	username?: string;
	password?: string;
    phoneNumber?: string;
    application?: string[];
	firstName?: string;
	lastName?: string;
	isInternal? : boolean;
	clientId?: string;
}

export interface UserLogin {
	login: string;
	password: string;
}

export interface UserChangePassword {
	id: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface UserCardDTO {
	id: string;
	email: string;
	username: string;
    application?: string[];
	roles?: string;
	firstName?: string;
	lastName?: string;
	isInternal? : boolean;
	clientId?: string;
	password?: string;
    phoneNumber?: string;
}
