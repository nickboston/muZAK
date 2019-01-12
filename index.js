const http = require('http');
const fs = require('fs');
const path = require('path');

let x;

http.createServer(function (request, response) {
    if (request.url == "/input"){
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        request.on('end', () => {
            console.log(body);
            x = body;
            process.stdout.write(body);
            response.json({output: x});
        });
    }
    else if (request.url == "/output"){
        response.end(x);
    }
    else {
        console.log('request ', request.url);

        let filePath = '.' + request.url;
        if (filePath == './') {
            filePath = './index.html';
        }

        let extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        let contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT') {
                    fs.readFile('./404.html', function(error, content) {
                        response.writeHead(200, { 'Content-Type': contentType });
                        response.end(content, 'utf-8');
                    });
                }
                else {
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end();
                }
            }
            else {
                response.writeHead(200, { 'Content-Type': contentType });
                response.end(content, 'utf-8');
            }
        });
    }
    

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');