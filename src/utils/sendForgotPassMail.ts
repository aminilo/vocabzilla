import transporter from '../config/email';

export const sendForgotPassMail = async (to: string, subject: string, html: string)=> {
	await transporter.sendMail({
		from: `"The App" <no-reply@${process.env.HOST || 'localhost'}:${process.env.PORT || 1234}>`,
		to, subject, html
	});
};
