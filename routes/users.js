const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

//User Model
const User = require("../models/User");


router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));
router.get("/update", (req, res) => res.render("update"));
router.get("/delete", (req, res) => res.render("delete"));

                                                    //Register Handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Fill in all fields" });
  }

  // check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords didn't match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters long" });
  }
  // redirecting to home or to validation

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email is already Registerd" });
        res.render("register", {
          errors,
          name,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          password2,
        });
        // Hashing Password

        newUser
          .save()
          .then((user) => {
            res.render("congrats");
          })
          .catch((err) => console.log(err));
      }

    });
  }
});
                                                          // Login Handle
router.post("/login", (req, res) => {
  const invalid = [];
  const { email, password } = req.body;
  User.findOne({ email: email, password: password }).then((user) => {
    if (!user) {
      invalid.push({ msg: "Invalid Credentials" });
    }
    if (invalid.length > 0) {
      res.render("login", {
        invalid,
      });

    }
    if (user) {
      res.render("dashboard");
    }
  });
});


                                                        // Update Password Handle
router.post("/update", (req, res) => {
  const { email, password, newPassword } = req.body;
  let update = [];
  if (!email || !password || !newPassword) {
    update.push({ msg: 'Fill in all fields' });
  }
  if (update.length > 0) {
    res.render("update", {
      update,
      email
    })
  }
  else {
    User.findOne({ email: email, password: password }).then((user) => {
      if (user) {
        if (newPassword.length < 6) {
          update.push({ msg: "New Password must atleast 6 characters long" })
          res.render("update", {
            update,
            email
          })
        }
        else {
          User.findOneAndUpdate({ email: email, password: password }, { password: newPassword })
            .then((user) => {
              update.push({ msg: "Password Changed Successfully" });
              res.render("update", {
                update
              })
            })
            .catch((err) => console.log(err));
        }
      }
      else {
        update.push({ msg: "User not found" });
        res.render("update", {
          update,
          email
        })
      }
    })
      .catch((err) => console.log(err));
  }

})
                                                // Delete Handle
router.post("/delete", (req, res)=>{
  const {email, password} = req.body;
  const del = [];
  User.findOneAndDelete({email: email, password: password}).then((user)=>{
    if(user){
      del.push({msg: 'Account Deleted Successfully'});
      res.render("register", {
        del
      })
    }
    else{
      del.push({msg: 'User not found! Try again with correct credientials'});
      res.render("delete", {
        del
      })
    }
  })
  .catch((err)=> console.log(err));





})


module.exports = router;
