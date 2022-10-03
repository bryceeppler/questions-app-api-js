const Prisma = require("prisma/prisma-client");
const prisma = new Prisma.PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator")

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

const loginUser = (req, res) => {
    const { username, password } = req.body;
    prisma.User
        .findUnique({
            where: {
                username: username,
            },
        })
        .then((user) => {
            // if the user wasn't found, return
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            // unhash password
            const valid = bcrypt.compareSync(password, user.password);
            if (valid) {
                const token = createToken(user.id);
                res.json({ 
                    token,
                    id: user.id,
                });
            } else {
                res.status(401).json({ error: "Invalid credentials" });
            }
        });
};

const registerUser = (req, res) => {
    const { username, email, phone, password } = req.body;

    // validation
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email" });
    }
    if (!validator.isMobilePhone(phone)) {
        return res.status(400).json({ error: "Invalid phone number" });
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ error: "Create a stronger password." });
    }

    // hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);


    prisma.User
        .create({
            data: {
                username,
                email,
                phone,
                password: hash,
                createdAt: new Date(),
            },
        })
        .then((user) => {
            const token = createToken(user.id);
            res.json({ 
                token,
                id: user.id,
            });
        });
};

// get by user id
const getUser = (req, res) => {
    const { id } = req.params;
    prisma.User
        .findUnique({
            where: {
                user_id: Number(id),
            },
            include: {
                questions: true,
                answers: true,
                relationships: true,
            },
        })
        .then((user) => {
            res.json(user);
        });
};

// get all users
const getAllUsers = (req, res) => {
    prisma.User
        .findMany()
        .then((users) => {
            res.json(users);
        });
};

const deleteUser = (req, res) => {
    const { id } = req.params;
    prisma.User
        .delete({
            where: {
                id: Number(id),
            },
        })
        .then((user) => {
            res.json(user);
        });
};

const searchByUsernameOld = (req, res) => {
    const { username } = req.body;
    prisma.User
        .findMany({
            where: {
                username: {
                    contains: username,
                },
            },
        })
        .then((users) => {
            res.json(users);
        });
};

const searchByUsername = (req, res) => {
    const { username } = req.body;
    prisma.User
        .findMany({
            where: {
                username: {
                    contains: username,
                },
            },
            include: {
                answers: true,
            },
        })
        .then((users) => {
            const usersWithNumAnswers = users.map((user) => {
                return {
                    ...user,
                    numAnswers: user.answers.length,
                };
            });
            res.json(usersWithNumAnswers);
        });
};

module.exports = {
    searchByUsername,
    loginUser,
    registerUser,
    getUser,
    getAllUsers,
    deleteUser,
};
