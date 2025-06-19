import { PrismaClient } from "@prisma/client";
import { transporter } from "../auth/register/2FAregister";

const Prisma = new PrismaClient();

export default async function getData(userId: number) {
  const userData = await Prisma.user.findFirst({
	where: { id: userId },
	select: {
	  username: true,
	  email: true,
	  bio: true,
	  as2FA: true,
	  elo: true,
	  win: true,
	  lose: true,
	  pointScored: true,
	  pointConcede: true,
	},
  });

  if (!userData) {
	throw new Error("User not found");
  }

  await transporter.sendMail({
	from: `"PongMaster" <${process.env.SMTP_USER || "pongmaster12345@gmail.com"}>`,
	to: userData.email,
	subject: "Your Personal Data - PongMaster",
	html: `
	  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
		<img src="https://github.com/M-U-C-K-A/transcendance/blob/main/public/school.jpeg?raw=true" alt="PongMaster Banner" style="width: 100%; max-height: 140px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;" />

		<h1 style="text-align: center; color: #0073e6;">Your Personal Data</h1>

		<p>Hello <strong>${userData.username}</strong>,</p>

		<p>In accordance with the General Data Protection Regulation (GDPR), here is a summary of the personal data we hold about you:</p>

		<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
		  <tbody>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Username</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.username}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.email}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Bio</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.bio || "Not provided"}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>2FA Enabled</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.as2FA ? "Yes" : "No"}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Elo</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.elo}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Wins</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.win}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Losses</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.lose}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Points Scored</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.pointScored}</td>
			</tr>
			<tr>
			  <td style="padding: 8px; border: 1px solid #ddd;"><strong>Points Conceded</strong></td>
			  <td style="padding: 8px; border: 1px solid #ddd;">${userData.pointConcede}</td>
			</tr>
		  </tbody>
		</table>

		<p>If you have any questions about your personal data or would like to exercise your rights (access, correction, deletion, etc.), please contact us at <a href="mailto:support@pongmaster.com">support@pongmaster.com</a>.</p>

		<p>Thank you for trusting us,</p>
		<p>The PongMaster Team</p>

		<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

		<p style="font-size: 12px; color: #999; text-align: center;">
		  © ${new Date().getFullYear()} PongMaster. All rights reserved.<br />
		  This is an automated message. Please do not reply directly.
		</p>
	  </div>
	`,
  });

  return(true)
}
