const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
});

const sendEmail =  async(to , subject , html) => {
    if (!to) throw new Error("Recipient email is required");
    if (!subject) throw new Error("Email subject is required");
    if (!html) throw new Error("Email content is required");

    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html
    };

    try{
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:' ,  info.messageId);
        return info;
    }catch(e){
        console.error("Error sending Email: " , e);
        throw e;
    }
}

module.exports = {
    sendEmail,
}