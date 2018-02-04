const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let titleLenthChecker = (title) => {
    if(!title) {
        return false;
    } else if( title.length < 5 || title.letngh > 50) {
        return false;
    } else {
        return true;
    }
};

let alphaNumericTitleChecker = (title) => {
  if (!title) {
    return false;
  } else {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title);
  }
};

const titleValidators = [
    {
        validator: titleLenthChecker,
        message: 'Titlemust be at least five charactors but not more then 50'
    },
    {
        validator: alphaNumericTitleChecker,
        message: 'Must be a valid alpha numeric title'
    }
];

let bodyLenthChecker = (body) => {
    if(!body) {
        return false;
    } else if( body.length < 5 || body.letngh > 500) {
        return false;
    } else {
        return true;
    }
};

const bodyValidators = [
    {
        validator: bodyLenthChecker, 
        message: 'Body must be at least 5 charactors but not more then 500'
    }
];

let commentLengthChecker = (comment) => {
    if (!comment[0]) {
        return false;
    } else if(comment[0].length < 1 || comment[0].length > 200) {
        return false;
    } else {
        return true;
    }
};

const commentValidators = [
    {
        validator: commentLengthChecker,
        message: 'Comment must be at least 1 characters but no more than 200'
    }
];

const blogSchema = new Schema({
    title: { type: String, required: true, validator: titleValidators},
    body: { type: String, required: true, validator: bodyValidators},
    createdBy: { type: String},
    createdAt: { type: Date, default: Date.now()},
    likes: { type: Number, default: 0},
    likedBy: { type: Array },
    dislikes: { type: Number, default: 0},
    dislikedBy: { type: Array },
    comments: [
        {
            comment: { type: String, validator: commentValidators },
            commentator: { type: String }
        }
    ]
});

module.exports = mongoose.model('Blog', blogSchema);