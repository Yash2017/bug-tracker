module.exports = require("mongoose").connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://yashkakade:yashkakade@bug-tracker.np7pj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
