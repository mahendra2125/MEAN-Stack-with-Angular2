const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let emailLenthChecker = (email) => {
    if(!email) {
        return false;
    } else if( email.length < 5 || email.letngh > 30) {
        return false;
    } else {
        return true;
    }
};

let validEmailChecker = (email) => {
  if (!email) {
    return false;
  } else {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }
};

const emailValidators = [
    {
        validator: emailLenthChecker,
        message: 'E-mail must be at least five charactors but not more then 30'
    },
    {
        validator: validEmailChecker,
        message: 'Must be a valid E-mail address'
    }
];

let userNameLenthChecker = (username) => {
    if(!username) {
        return false;
    } else if( username.length < 3 || username.letngh > 15) {
        return false;
    } else {
        return true;
    }
};

let validUsername = (username) => {
    if(!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [
    {
        validator: userNameLenthChecker, 
        message: 'username must be at least three charactors but not more then 15'
    },
    {
        validator: validUsername,
        message: 'Username must not have any special charactors'
    }
];


let passwordLengthChecker = (password) => {
    if (!password) {
        return false;
    } else if(password.length < 8 || password.length > 35) {
        return false;
    } else {
        return true;
    }
};

let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};
const passwordValidators = [
    {
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more than 35'
    },
    {
        validator: validPassword,
        message: 'Must have at least one uppercase, lowercase, special character, and number'
    }
];

const userSchema = new Schema({
    email: { type: String, required: true, lowercase: true, unique: true, validate: emailValidators},
    username: { type: String, required: true, lowercase: true, unique: true, validate: usernameValidators },
    password: { type: String, required: true, validate: passwordValidators}
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);