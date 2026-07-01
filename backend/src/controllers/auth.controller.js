

import authService from "../services/auth.service.js";

export const googleCallback = async (req, res, next) => {
  try {
    const result = await authService.loginWithGoogle(
      req.account,
      req
    );

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      token: result.accessToken,
      user: result.user
    });

  } catch (error) {
    next(error);
  }
};
