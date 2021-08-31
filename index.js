const express = require("express");
const morgan = require("morgan");
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 3000;
const PHOTOPATH = __dirname + '/image.jpg';

app.use(morgan("combined"));
app.use(fileUpload());

const indexHtml = `
<!DOCTYPE html>
<html>
<head>
<title>Kraby Krab</title>
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

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const photo = req.files.photo;
    photo.mv(PHOTOPATH, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded!');
    });
});

app.use((req, res) => {
    res.status(404).send("404: File not found");
});

app.use((error, req, res, next) => {
    res.status(500).send("500: Internal server error");
})

app.listen(PORT, () => {
    console.log(`Service started on port: ${PORT}`);
})
