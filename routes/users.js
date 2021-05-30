const express = require("express");
const router = express.Router();
const passport = require("passport");

// controller for users
const users_controller = require("../controllers/users_controller");

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  users_controller.profile
);
router.get("/follow", users_controller.follow);
router.get("/unfollow", users_controller.unfollow);
router.get("/sign-in", users_controller.sign_in);
router.get("/sign-up", users_controller.sign_up);
router.get("/sign-out", users_controller.sign_out);
router.get("/forgot-password", users_controller.forgot_password);
router.post("/to-security-check", users_controller.to_security_check);
router.post("/to-reset-passsword/:email", users_controller.to_reset_password);
router.post("/reset-passsword/:token", users_controller.reset_password);

router.post("/create-user", users_controller.create_user);
router.post(
  "/profile-update/:id",
  passport.checkAuthentication,
  users_controller.profile_update
);

// add passport as a middleware for authentication
router.post(
  "/create-session",
  passport.authenticate(
    // strategy used by passport
    "local",
    // if authentication fails, redirect to other page
    { failureRedirect: "/users/sign-in" }
  ),
  users_controller.create_session
);

//                                            ********* console.developer.google.com

// javascript origin ,-- route that takes to google authentication
// scope -> asking for vars needed , email isnt included in profile
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback redirect , google -> startegy name
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/sign-in" }),
  users_controller.create_session
);
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/users/sign-in" }),
  users_controller.create_session
);
module.exports = router;
