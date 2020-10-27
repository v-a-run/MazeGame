const express = require('express');
const app = express();

app.use(express.static(__dirname + "/public"));
app.engine('html', require('ejs').renderFile);

app.get("/", (req, res) => {
    res.render("index.html");
});

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Game about to start..");
})