export interface CustomerDetails {
    id: string;
    firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
    age: number;
    birthday: string;
    favoriteColor: string;
	avatar: string;
}
export interface Customer {
    id: string;
    firstName: string;
	lastName: string;
	email: string;
	phoneNumber: string;
    birthDate: Date;
    favoriteColor: string;
	photo: string;
}


export interface CreateCustomerFormValues {
	firstName?: string;
	lastName?: string;
    email: string;
    phoneNumber?: string;
    birthDate: Date;
    favoriteColor: string;
    photo: FormData;
}

export interface SearchCustomersForm {
	searchCustomersQry: string;
}


export interface UpdateCustomerDTO {
	firstName?: string;
	lastName?: string;
	email?: string;
    phoneNumber?: string;
    birthDate?: Date;
    favoriteColor?: string;
    photo?: FormData;
}
