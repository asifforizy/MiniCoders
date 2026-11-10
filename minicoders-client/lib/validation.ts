import z from "zod";


export const LoginZodSchema = z.object({
	email: z.email(),
	password: z
		.string()
		.min(8, "Password Must Minimum 8 Characters Long.")
		.regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
		.regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

		.regex(/[0-9]/, "Password must contain atleast 1 Number")
		.regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
});



export const UserRegistrationZodSchema = z.object({
		name: z
			.string("Not A String!!!!!")
			.min(3, "Name must atleast 3 characters long!!!")
			.max(10),
		email: z.email("Not email!!"),
		password: z
			.string()
			.min(8, "Password Must Minimum 8 Characters Long.")
			.regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
			.regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
			.regex(/[0-9]/, "Password must contain atleast 1 Number")
			.regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
		patient: z
			.object({
				contactNumber: z.string().optional(),
			})
			.optional(),
	}).refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});



    export const UserEmailVerifyZodSchema = z.object({
	email: z.email("Not email!!"),
	otp: z.string().length(6),
});




export const ForgotPasswordZodSchema = z.object({
	email: z.email(),
});

export const ResetPasswordZodSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password Must Minimum 8 Characters Long.")
			.regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
			.regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
			.regex(/[0-9]/, "Password must contain atleast 1 Number")
			.regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});