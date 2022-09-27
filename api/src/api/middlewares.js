// middleware file
const jwt = require('jsonwebtoken');
const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();
// middleware to require login/auth
exports.requireAuth = async function(req, res, next) {
    // Verify web token
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.' });
    }

    const token = authorization.replace('Bearer ', '');

    try {
        // grab username from token and get the user from the database
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = prisma.User.findUnique({
            where: {
                id: id,
            },
        }).id;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).send({ error: 'You must be logged in.' });
    }
};