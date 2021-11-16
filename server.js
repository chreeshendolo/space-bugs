const fs = require("fs");
const http = require("http");

const server = http.createServer(requestHandler);

server.on('error', console.log.bind(console));

server.listen(80, console.log.bind(console, `HTTP SERVER LISTENING ON: ${80}`));

const routing = {
	html: "text/html",
	js: "text/js",
	png: "image/png",
	wav: "audio/wav",
	mp3: "audio/mp3",
	ico: "image/x-icon",
};

function requestHandler(request, response) {
	const path = "./lib" + (request.url === "/" ? "/index.html" : request.url);
	const type = routing[path.split(".")[2]];

	if (type === undefined || !fs.existsSync(path)) {
		response.writeHead(404);
		response.write("<strong>Oops 404 bad request/response</strong>");
		response.end();
		return;
	}

	response.setHeader("Content-Type", type);

	const readStream = fs.createReadStream(path);
	const pipe = readStream.pipe(response);

	pipe.on("error", function (e) { console.log(e)})
}
