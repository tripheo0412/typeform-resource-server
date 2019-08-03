const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const isEmpty = require('../../utils/isEmpty');
const User = require('../../models/user');
const { keys } = require('../../config');

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: keys.ACCESS_SECRET,
      passReqToCallback: true,
    },
    async (req, payload, done) => {
      try {
        const user = await User.findById(payload.aud);

        if (isEmpty(user)) {
          return done(null, false);
        }

        req.user = user;
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
