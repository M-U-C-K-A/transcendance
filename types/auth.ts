import { z } from "zod";
import { useI18n } from "@/i18n-client";

const t = useI18n();

// /auth/login
export const loginData = z.object({
	pass: z.string()
		.min(6, { message: t('zod.password.tooShort') })
		.max(30, { message: t('zod.password.tooLong') })
		.regex(/[a-z]/, { message: t('zod.password.needLowercase') })
		.regex(/[A-Z]/, { message: t('zod.password.needUppercase') })
		.regex(/\d/, { message: t('zod.password.needNumber') })
		.regex(/[^A-Za-z0-9]/, { message: t('zod.password.needSpecialChar') }),
	email: z.string().email({ message: t('zod.email.invalid') })
		.min(5, { message: t('zod.email.tooShort') })
		.max(100, { message: t('zod.email.tooLong') }),
});

// /auth/login/2fa/verify
// /auth/register/2fa/verify
export const login2FA = z.object({
	email: z.string().email({ message: t('zod.email.invalid') })
		.min(5, { message: t('zod.email.tooShort') })
		.max(100, { message: t('zod.email.tooLong') }),
	code: z.string()
		.min(6, { message: t('zod.code.invalid') })
		.max(6, { message: t('zod.code.invalid') }),
});

// /auth/register
export const registerData = z.object({
	username: z.string()
		.min(3, { message: t('zod.username.tooShort') })
		.max(20, { message: t('zod.username.tooLong') })
		.regex(/^[a-zA-Z0-9_]+$/, { message: t('zod.username.invalidChar') }),
	pass: z.string()
		.min(6, { message: t('zod.password.tooShort') })
		.max(30, { message: t('zod.password.tooLong') })
		.regex(/[a-z]/, { message: t('zod.password.needLowercase') })
		.regex(/[A-Z]/, { message: t('zod.password.needUppercase') })
		.regex(/\d/, { message: t('zod.password.needNumber') })
		.regex(/[^A-Za-z0-9]/, { message: t('zod.password.needSpecialChar') }),
	email: z.string().email({ message: t('zod.email.invalid') })
		.min(5, { message: t('zod.email.tooShort') })
		.max(100, { message: t('zod.email.tooLong') }),
});
