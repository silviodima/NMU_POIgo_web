const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const POI = require("./routes/api/pois");
const upload = require("./routes/api/upload");
const categories = require("./routes/api/categories");

const app = express();
app.use('/api/upload', express.json({ limit: '50mb' }), express.urlencoded({extended:true, limit: '50mb' }), upload);

// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
    useUnifiedTopology: true}
  )
  .then(() => console.log("\nMongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/pois", POI);
app.use("/api/upload", upload);
app.use("/api/categories", categories);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
