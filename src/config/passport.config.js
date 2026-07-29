import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { userRepository } from '../repositories/user.repository.js';
import { isValidPassword } from '../utils/hash.js';
import { RegisterDTO } from "../DTOs/user.dto.js";
import { env } from '../config/env.js';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { sessionService } from '../services/session.service.js';


passport.use("register", new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const dto = new RegisterDTO(req.body);
            const newUser = await sessionService.register(dto);
            return done(null, newUser);
        } catch (error) {
            if (error.statusCode === 409) {
                return done(null, false, { message: error.message });
            }
            return done(error);
        }
    }
));


passport.use("login", new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
        try {
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return done(null, false, { message: "Credenciales inválidas" });
            }

            const validPassword = await isValidPassword(password, user.password);
            if (!validPassword) {
                return done(null, false, { message: "Credenciales inválidas" });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.currentUser;
    }
    return token;
};

passport.use("current", new JwtStrategy(
    {
        jwtFromRequest: cookieExtractor,
        secretOrKey: env.JWT_SECRET
    },
    async (payload, done) => {
        try {
            return done(null, payload);
        } catch (error) {
            return done(error);
        }
    }
));