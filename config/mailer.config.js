const nodemailer = require('nodemailer');

const host = process.env.PORT || 'https://localhost:3000/';
const user = process.env.NM_USER;

const transport = nodemailer.createTransport(
    {
        service: 'Gmail',
        auth: {
            user: user,
            pass: process.env.NM_PASS
        }
    }
)

module.exports.sendValidationEmail = ({ id, email, activationToken, name }) => {
    transport.sendMail({
        to: email,
        from: 'La Buena Vida team',
        subject: 'Please activate your account in a simple step',
        html: `         
        <div style='text-align:center; background-color:rgb(232,232,232)'>
        <h1>Project Management Tool Confirmation Email!</h1>
        <h2>Hello ${username}</h2>
        <p> Thanks to join our community! Please confirm your account clicking on the following link:</p>
        <a href="https://project-management-tool-miguel.herokuapp.com/activate/${token}"> Please click the link to confirm your account </a>
        <h3>Enjoy 😎</h3>
        </div>`
    })
        .then(console.log)
        .catch(console.error)
};