const nodemailer=require('nodemailer');

exports.sendMail=async(email,subject,body)=>{
    return new Promise((resolve, reject)=>{
        const transporter=nodemailer.createTransport({
            service:'Gmail',
            auth:{
                user:'mordahatanella@gmail.com',
                pass:'HbibaCiao1982!!'
            }
    
        });
        const mailOptions={
            from:'mordahatanella@gmail.com',
            to:email,
            subject:subject,
            text:body
        };
        let response;
        transporter.sendMail(mailOptions,(info,error)=>{
            if(error) {
                console.log('Error sending mail:', error)
                reject({message:'Error sending mail',statusCode:500});
              
        }
               
            else     {
                    console.log('Email sent:',info.response);
    
                    resolve({ message:'Password reset OTP sent to your email' ,statusCode:200});}
              
        });
        return response;
    })
}