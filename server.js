const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = process.env.PORT || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

http
  .createServer((request, response) => {
    const urlPath = decodeURIComponent(request.url.split("?")[0]);
    const relativePath = urlPath === "/" ? "index.html" : urlPath.slice(1);
    const filePath = path.resolve(root, relativePath);

    if (filePath !== root && !filePath.startsWith(root + path.sep)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      const resolvedPath = !statError && stats.isDirectory() ? path.join(filePath, "index.html") : filePath;

      fs.readFile(resolvedPath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(resolvedPath).toLowerCase()] || "application/octet-stream"
      });
      response.end(data);
    });
    });
  })
  .listen(port, () => {
    console.log(`AseVerse demo running at http://localhost:${port}`);
  });
