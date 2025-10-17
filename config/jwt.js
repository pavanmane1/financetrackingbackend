const jwtConfig = {
    secret: process.env.JWT_SECRET || 'asdfadddd123456fg3838363822323332321wadqsd',
    expiresIn: '24h'
};

module.exports = { jwtConfig };
