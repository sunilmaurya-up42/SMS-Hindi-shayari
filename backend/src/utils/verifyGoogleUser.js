

import authService from "../services/auth.service.js";

const verifyGoogleUser = async (profile, req) => {
  return await authService.loginWithGoogle(profile, req);
};

export default verifyGoogleUser;
