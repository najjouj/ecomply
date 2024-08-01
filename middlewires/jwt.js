const { expressjwt: expjwt } = require('express-jwt');
const { Token } = require('../models/tokens');


function authJwt() {
    const api = 'http://192.168.129.223:3000';
    return expjwt({
        secret: 'sdf90wjesdf90wjesdf90wjesdf90wje',
        algorithms: ['HS256'],
        isRevoked: isrevoked

    }).unless({
        path: [
            `http://192.168.129.223:3000'/login`,
            `http://192.168.129.223:3000'/login/`,

            `http://192.168.129.223:3000'/register`,
                `http://192.168.129.223:3000'/register/`,

            `http://192.168.129.223:3000'/verify-token`,
                `http://192.168.129.223:3000'/verify-token/`,

            `http://192.168.129.223:3000'/forgot-password`,
                `http://192.168.129.223:3000'/forgot-password/`,

            `http://192.168.129.223:3000'/verify-otp`,
                `http://192.168.129.223:3000'/verify-otp/`,

            `http://192.168.129.223:3000'reset-password`,
                `http://192.168.129.223:3000'/reset-password/`

        ]
    });
}
async function isrevoked(req, jwt) {
    const authHeader = req.header('Authorization');
    if (authHeader.startsswith('Bearer')) {
        return true;
    }
    const accessToken = authHeader.replace('Bearer', '').trim();
    const token = await Token.findOne({ accessToken });
    const adminRouteRegex = /^\/api\/v1\/admin\//i;
    const adminFault = !jwt.payload.isAdmin && adminRouteRegex.test(req.originalUrl);

    return adminFault || !token;
}

module.exports = authJwt;


// `http://192.168.129.223:3000'/login/`,

// `http://192.168.129.223:3000'/register`
// `http://192.168.129.223:3000'/register/`,

// `http://192.168.129.223:3000'/verify-token`
// `http://192.168.129.223:3000'/verify-token/`,

// `http://192.168.129.223:3000'/forgot-password`
// `http://192.168.129.223:3000'/forgot-password/`,

// `http://192.168.129.223:3000'/verify-otp`
// `http://192.168.129.223:3000'/verify-otp/`,

//  `http://192.168.129.223:3000'reset-password`
// `http://192.168.129.223:3000'/reset-password/`