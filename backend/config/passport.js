const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./db');

// Local strategy for username/password authentication
passport.use(new LocalStrategy(
  { usernameField: 'email' },  // Passport expects "username", so we tell it to use "email" instead
  async (email, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (result.rows.length === 0) {
        return done(null, false, { message: 'Email not found' });
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);  // Authentication successful, return user
    } catch (err) {
      return done(err);
    }
  }
));

// Serialize user (store user ID in the session)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user (retrieve user from the session)
passport.deserializeUser(async (id, done) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        done(null, user.rows[0]);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;