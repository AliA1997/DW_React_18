import { User } from "./user";

export interface Profile {
	id: string;
	username: string;
	email: string;
	title: string;
	firstName: string;
	lastName: string;
	phoneNumbers: string[];
}

export class Profile implements Profile {
    constructor(user: User) {
        this.username = user.username;
		this.email = user.email;
		this.firstName = user.firstName;
		this.lastName = user.lastName;
				
	}    
}