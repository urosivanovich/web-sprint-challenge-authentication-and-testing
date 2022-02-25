module.exports = { 
    JWT_SECRET: process.env.JWT_SECRET || 'say AAAA and I might tell you',
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 8,
}