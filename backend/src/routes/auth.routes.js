import { Router } from "express";
import passport from "passport";

import {
  googleCallback
} from "../controllers/auth.controller.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/"
  }),
  googleCallback
);

export default router;
