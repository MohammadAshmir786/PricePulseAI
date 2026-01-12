import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

function getClientOrigin() {
  const origins = process.env.CLIENT_ORIGIN?.split(",").map((o) => o.trim()).filter(Boolean);
  return origins?.[0] || "http://localhost:5173";
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("name email role provider providerId avatar");
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const googleCallbackURL = `${process.env.SERVER_BASE_URL || ""}/api/auth/google/callback`;
const githubCallbackURL = `${process.env.SERVER_BASE_URL || ""}/api/auth/github/callback`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: googleCallbackURL || "/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const name = profile.displayName || profile.name?.givenName || "User";
          const avatar = profile.photos?.[0]?.value || null;
          if (!email) return done(new Error("Google profile missing email"));

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name,
              email,
              provider: "google",
              providerId: profile.id,
              avatar,
            });
          } else {
            // Backfill provider details if missing
            if (!user.provider) {
              user.provider = "google";
              user.providerId = profile.id;
              user.avatar = avatar;
              await user.save();
            }
            // Optionally update avatar on each login
            user.avatar = avatar;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: githubCallbackURL || "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub may return email in profile.emails or require fetching; use first available
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const name = profile.displayName || profile.username || "User";
          const avatar = profile.photos?.[0]?.value || profile._json?.avatar_url || null;
          if (!email) return done(new Error("GitHub profile missing email"));

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name,
              email,
              provider: "github",
              providerId: profile.id,
              avatar,
            });
          } else {
            if (!user.provider) {
              user.provider = "github";
              user.providerId = profile.id;
              user.avatar = avatar;
              await user.save();
            }
            // Optionally update avatar on each login
            user.avatar = avatar;
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

export default passport;
