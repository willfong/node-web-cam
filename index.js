const crypto = require("crypto");
const express = require("express");
const fileUpload = require('express-fileupload');
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;
const PHOTOPATH = __dirname + '/image.jpg';

const TITLE = process.env.TITLE || 'NODE-WEB-CAM';
const UPLOADTOKEN = process.env.UPLOADTOKEN || crypto.randomBytes(20).toString('hex');;

app.use(morgan("combined"));
app.use(fileUpload());

const indexHtml = `
<!DOCTYPE html>
<html>
<head>
<title>${TITLE}</title>
<style>
body, html {
  height: 100%;
}
.bg {
  background-image: url("image.jpg");
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
</head>
<body>
<div class="bg"></div>
</body>
</html>
`

app.get("/", (req, res) => {
    res.send(indexHtml);
});

app.get("/image.jpg", (req, res) => {
    res.sendFile(PHOTOPATH);
});


app.post('/upload', (req, res) => {
    const userToken = req.headers.uploadtoken;
    if (!userToken) return res.status(400).send("No UPLOADTOKEN header");
    if (userToken !== UPLOADTOKEN) return res.status(400).send("Incorrect UPLOADTOKEN.");

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    const photo = req.files.photo;
    if (!photo) return res.status(404).send("No PHOTO file found.");

    photo.mv(PHOTOPATH, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

app.use((req, res) => {
    res.status(404).send("404: File not found");
});

app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send("500: Internal server error");
})

app.listen(PORT, () => {
    console.log(`Service started on port: ${PORT}`);
    console.log(`Upload Token: ${UPLOADTOKEN}`);
})
