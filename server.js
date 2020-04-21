//Install express server
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SECRET],
    maxAge: 2 * 24 * 60 * 1000
  })
);

app.use(express.static(__dirname + "/dist/Holiday-Me"));

app.get("/*", function(req, res) {
  res.cookie("holiday_request_service_url", process.env.HOLIDAY_REQUESTS_SERVICE_URL);
  res.cookie("token_request_url", process.env.TOKEN_REQUEST_URL);
  res.cookie("oidc_client_id", process.env.OIDC_CLIENT_ID);
  res.cookie("redirect_page_to_oidc", process.env.REDIRECT_PAGE_TO_OIDC);
  res.cookie("approver_redirect_page_to_oidc", process.env.APPROVER_REDIRECT_PAGE_TO_OIDC);
  res.cookie("approver_oidc_client_id", process.env.APPROVER_OIDC_CLIENT_ID);

  res.sendFile(path.join(__dirname + "/dist/Holiday-Me/index.html"));
});

app.listen(process.env.PORT || 8080);
