const http=require("http");
const fs=require("fs");

const logRequests="yes";
const logRequestor="yes";

// CONSOLE COLORS
const colors={
	"Reset": "\x1b[0m",
	"FgBlack": "\x1b[30m",
	"FgRed": "\x1b[31m",
	"FgGreen": "\x1b[32m",
	"FgYellow": "\x1b[33m",
	"FgBlue": "\x1b[34m",
	"FgMagenta": "\x1b[35m",
	"FgCyan": "\x1b[36m",
	"FgWhite": "\x1b[37m",
	"BgBlack": "\x1b[40m",
	"BgRed": "\x1b[41m",
	"BgGreen": "\x1b[42m",
	"BgYellow": "\x1b[43m",
	"BgBlue": "\x1b[44m",
	"BgMagenta": "\x1b[45m",
	"BgCyan": "\x1b[46m",
	"BgWhite": "\x1b[47m"
}

// FUNCTION: TIME STAMP
function timeStamp(){
	let CurrTime=new Date();
	let mo=CurrTime.getMonth()+1;if(mo<10){mo="0"+mo;}let da=CurrTime.getDate();if(da<10){da="0"+da;}let yr=CurrTime.getFullYear();
	let hr=CurrTime.getHours();if(hr<10){hr="0"+hr;}let min=CurrTime.getMinutes();if(min<10){min="0"+min;}let sec=CurrTime.getSeconds();if(sec<10){sec="0"+sec;}
	return colors.FgBlue+yr+"/"+mo+"/"+da+" @ "+hr+":"+min+":"+sec+colors.Reset+" |"
}


// CONSOLE WHEN LAUNCHED
console.info(timeStamp()+" -- ["+colors.FgMagenta+"localhost"+colors.Reset+"] WebServer is now "+colors.FgGreen+"READY"+colors.Reset+" --");

// VARIABLES AND ARRAYS
var requestor=""
var availableTypes=["css","js","ico","jpg","png","gif","ttf","woff","html"];
var availableContentTypes=["text/css","text/javascript","image/x-icon","image/jpeg","image/jpeg","image/gif","application/x-font-ttf","application/font-woff","text/html"];

const MSG_NOTFOUND="<br /><br /><center><h1>[<span style='color:#F00'>404</span>] PAGE/FILE <span style='color:#F00'>NOT</span> FOUND</h4></center>";

// CREATE HTTP SERVER
http.createServer(function (requested, response) {
	if(requested.url==="/"){
		console.info(timeStamp()+" Attempting to access file: "+colors.FgMagenta+"index.html")
		requested.url="/index.html"
	}
	let extension=requested.url.split("."); extension=extension[1];
	
	if(requested.headers){
		if(requested.headers['user-agent']!==requestor){
			requestor=requested.headers['user-agent'];
			if(logRequestor==="yes"){
				console.info(timeStamp()+" Incoming Request from: "+colors.FgCyan+requestor)
			}
		}
	}
	if(availableTypes.includes(extension)){
		let fileType=availableContentTypes[availableTypes.indexOf(extension)];
		fs.readFile(requested.url.slice(1), function(err, data) {
			if (err) {
				response.writeHead(404, {'Content-Type': 'text/html'});
				if(logRequests==="yes"){
					console.info(timeStamp()+" File Requested: "+colors.FgMagenta+requested.url.slice(1)+colors.Reset+"   <- - -   "+colors.FgRed+"NOT FOUND!")
				}
				return response.end(MSG_NOTFOUND);
			}
			if(logRequests==="yes"){
				console.info(timeStamp()+" File Requested: "+colors.FgMagenta+requested.url.slice(1))
			}
			response.writeHead(200, {'Content-Type': fileType});
			response.write(data);
			response.end();
		})
	}
	else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		console.info(timeStamp()+" File Requested: "+colors.FgMagenta+requested.url.slice(1)+colors.Reset+"   <- - -   "+colors.FgRed+"NOT FOUND!");
		console.info(timeStamp()+" "+colors.FgWhite+colors.BgRed+" ERROR "+colors.Reset+" INVALID FILE - FILETYPE NOT ACCEPTED!");
		return response.end(MSG_NOTFOUND);
	}
}).listen(80);
