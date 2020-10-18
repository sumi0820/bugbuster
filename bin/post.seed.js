const mongoose = require('mongoose')

require('../config/db.config')
const PostModel = require('../models/Post.model')

PostModel.create({
  title: "First post",
  description: "This is test",
  image: '',
  user: [],
  review: [],
  like: [],
}).then(()=>{
  console.log("Data added");
  mongoose.connection.close()
}).catch(err=>{
  console.log(err);
})
