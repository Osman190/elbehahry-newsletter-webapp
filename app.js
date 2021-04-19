const express = require('express');
const request = require('request');
const https = require('https');
const app = express();

const PORT = 3000

app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))


app.get("/", function(req, res) {
  res.sendFile(`${__dirname}/index.html`)
})

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
  }

  let jsonData = JSON.stringify(data);
  const url = "https://us1.api.mailchimp.com/3.0/lists/f220a6df19/members"
  const options = {
    method: "POST",
    auth: "elbehary:399830759a0c76c6eabc4fcafeb9839c-us1"
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log( JSON.parse(data))
      if(response.statusCode === 200) {
        res.sendFile(`${__dirname}/success.html`)
      } else {
        res.sendFile(`${__dirname}/failure.html`)
      }
    })
  })
  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/")
})


app.listen(process.env.PORT || 3000, () => {console.log(`Server is Running on ${PORT}`)})

// API KEY
// 399830759a0c76c6eabc4fcafeb9839c-us1

// List Id
// f220a6df19