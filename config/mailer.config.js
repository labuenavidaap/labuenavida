const nodemailer = require('nodemailer')
const host = process.env.PORT || 'https://localhost:3000/'
const user = process.env.NM_USER

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
        <h1>La Buena Vida Confirmation Email!</h1>
        <h2>Hello ${name}</h2>
        <p> Thanks to join our community! Please confirm your account clicking on the following link:</p>
        <a href="http://localhost:3000/users/${id}/activate/${activationToken}" target="_blank"> Please click the link to confirm your account </a>
        <h3>Enjoy 😎</h3>
        </div>`
    })
        .then(console.log)
        .catch(console.error)
}

module.exports.sendOrder = ({ id, email, name, order }) => {
    transport.sendMail({
        to: email,
        from: 'La Buena Vida team',
        subject: 'Thanks for buying in La Buena Vida',
        html: `
        <div style='text-align:center; background-color:rgb(232,232,232)'>
        <h1>Order Confirmation Email!</h1>
        <h2>Hello ${name}</h2>
        <p> Thanks for buying in La Buena Vida:</p>
        <p> You will receive your products in 48 hours</p>
        <p> Total: ${order}€</p>
        <a href="http://localhost:3000/users/${id}"> Check your orders </a>
        <h3>Enjoy 😎</h3>
        </div>
        `
    })
}

