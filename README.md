# Node Web Cam

A simple service to display a photo.

## Getting Started

```
docker run --restart always -d --name nodewebcam -p 5000:3000 -e TITLE=NodeWebCam -e UPLOADTOKEN=123XYZ wfong/node-web-cam
```

Upload with `curl`:
```
curl -H "uploadtoken: 123XYZ" -F "photo=@image.jpg" localhost:5000/upload
```

