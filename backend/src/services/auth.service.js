

import User from "../models/user.model.js";
import RefreshToken from "../models/refreshToken.model.js";

import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";

class AuthService {
  async loginWithGoogle(profile, req) {
    let user = await User.findOne({
      email: profile.emails[0].value
    });

    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePhoto: profile.photos?.[0]?.value || "",
        lastLogin: new Date()
      });
    } else {
      user.googleId = profile.id;
      user.profilePhoto = profile.photos?.[0]?.value || user.profilePhoto;
      user.lastLogin = new Date();

      await user.save();
    }

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"] || ""
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }
}

export default new AuthService();
