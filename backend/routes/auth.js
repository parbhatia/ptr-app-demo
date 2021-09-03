const express = require("express")
const router = express.Router()
const db = require("../config/db")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const debug = require("debug")("backend:auth")
const {
    users: { select_by_id, select_by_email },
} = require("../sql")
const rateLimit = require("express-rate-limit")
const cookieParser = require("cookie-parser")
const logger = require("../logger/winston.js")
const expiryDays = 7
const passportCookieToken = "ptr-passport-cookie"

// rate limiter used on auth attempts
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15, // limit each IP to 100 requests per windowMs
    message: {
        status: "fail",
        message: "Too many requests, please try again later",
    },
})

// parse cookies
router.use(cookieParser())

const generateAuthToken = (userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWTSECRETKEY, {
        expiresIn: `${expiryDays} days`,
    })
    return token
}

//async finds user in database and returns in
const findUserByEmail = async(email, password) => {
    const user = await db.one(select_by_email, email)
    const match = await bcrypt.compare(password, user.password)
    if (match) {
        return user
    } else {
        throw "NOT FOUND"
    }
}

//async finds user in database and returns in
const findUserById = async(id) => {
    const user = await db.one(select_by_id, id)
    if (user) {
        return user
    } else {
        throw "NOT FOUND"
    }
}

const jwtVerify = async(req, res, next) => {
    try {
        // get token from cookies
        const token = req.cookies.authToken

        if (!token) {
            throw new Error("Invalid Token")
        }

        //jwt will throw on mismatch or token malformed
        const decoded = jwt.verify(token, process.env.JWTSECRETKEY)

        //extract user embedded in jwt
        req.user = decoded

        next()
    } catch (e) {
        debug("Access Denied. Invalid Token", e)
        res.sendStatus(403)
    }
}

//called by nginx for auth
//determines if token is valid
router.get("/", jwtVerify, async(req, res) => {
    try {
        //expect user to be embedded
        if (!req.user) {
            throw new Error()
        }

        // user is already authenticated, refresh cookie by creating new token
        const token = generateAuthToken(req.user.id)

        // set JWT as cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 1000 * 86400 * expiryDays, // milliseconds
            secure: process.env.NODE_ENV === "production",
            sameSite: true,
        })

        //embed user in custom header to avoid name conflicts
        //nginx will add user's id to header after auth
        res.set("Token-user_id", req.user.id)

        res.sendStatus(200)
    } catch (e) {
        debug("Invalid Token")
        res.clearCookie("authToken")
        return res.sendStatus(403)
    }
})

//used to login
router.post("/login", apiLimiter, async(req, res) => {
    const { email, password } = req.body
    try {
        logger.warn(`Attempted Login with ip: ${req.ip}`)
            //findUserByEmail will throw on unsuccess
        const user = await findUserByEmail(email, password)
            //create new token
        const token = generateAuthToken(user.id)

        // set JWT as cookie
        res.cookie("authToken", token, {
                httpOnly: true,
                maxAge: 1000 * 86400 * expiryDays, // milliseconds
                secure: process.env.NODE_ENV === "production",
                sameSite: true,
            })
            // use another non http cookie, to send to user, so we can check if such a cookie exists when opening app for the first time
        res.cookie("ptr-passport", passportCookieToken, {
            httpOnly: false,
            maxAge: 1000 * 86400 * expiryDays, // milliseconds
            secure: process.env.NODE_ENV === "production",
            sameSite: true,
        })
        res.send({
            id: user.id,
            firstName: user.firstname,
            lastName: user.lastname,
            email: user.email,
            phone_number: user.phone_number,
            profile_pic_keyid: user.profile_pic_keyid,
            email_signature: user.email_signature,
        })
    } catch (e) {
        debug("Could not authenticate", e)
        res.sendStatus(401)
    }
})

// check if user is already logged in
router.get("/login", jwtVerify, async(req, res) => {
    try {
        if (req.user) {
            const user = await findUserById(req.user.id)
            res.send({
                id: user.id,
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
                phone_number: user.phone_number,
                profile_pic_keyid: user.profile_pic_keyid,
                email_signature: user.email_signature,
            })
        } else {
            throw new Error("Unauthorized")
        }
    } catch (e) {
        res.redirect("/error.html")
    }
})

// endpoint called to logout and clear cookie
router.post("/logout", apiLimiter, jwtVerify, (req, res) => {
    res.clearCookie("authToken")
    res.clearCookie("ptr-passport")
    res.sendStatus(200)
})

module.exports.router = router