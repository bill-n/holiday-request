//Install express server
const express = require("express");
const path = require("path");
// const cookieSession = require("cookie-session");
// const cookieParser = require("cookie-parser");

const app = express();

// app.use(cookieParser());

/*
app.use(
  // To protect the cookies
  cookieSession({
    name: "session",
    keys: [process.env.SECRET],
    maxAge: 2 * 24 * 60 * 1000 // For just 1 day
  })
);
*/
app.use(express.static(__dirname + "/dist/Holiday-Me"));

app.get("/*", function(req, res) {
  res.cookie("backend_url", process.env.REQUESTS_SERVICE);
  res.sendFile(path.join(__dirname + "/dist/Holiday-Me/index.html"));
});

app.listen(process.env.PORT || 8080);
