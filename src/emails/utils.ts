import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.PASS_FROM_GMAIL,
  },
});

export const sendEmail = ({
  subject,
  text,
  onSuccess,
  onError,
  to,
}: {
  to: string;
  subject: string;
  text: string;
  onSuccess: () => void;
  onError: () => void;
}) => {
  const mailOptions = {
    from: 'learn-nodejs@gmail.com',
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      onError();
    } else {
      onSuccess();
    }
  });
};
