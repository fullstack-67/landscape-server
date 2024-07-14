var path = require("path");
var livereload = require("livereload");

const extensionsToWatch = ["html", "pug"];
const locs = [path.join(__dirname, "src"), path.join(__dirname, "views")];
const liveReloadServer = livereload.createServer({
  port: 35729,
  debug: true,
  exts: extensionsToWatch,
  delay: 2000,
});

// Listen for errors
liveReloadServer.on("error", (err) => {
  if (err.code == "EADDRINUSE") {
    console.log("The port LiveReload wants to use is used by something else.");
    process.exit(1);
  }
});

liveReloadServer.watch(locs);
