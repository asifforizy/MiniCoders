export interface IRegisterKidsPayload {
	name: string;
	email: string;
	password: string;
	kids: {
		contactNumber?: string;
	};
}