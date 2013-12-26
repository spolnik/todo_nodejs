var http = require('http');
var TodoEngine = require('./lib/todo_engine');

var todoEngine = new TodoEngine();

var server = http.createServer(function (req, res) {
    if ('/' == req.url) {
        switch (req.method) {
            case 'POST':
                todoEngine.addItem(req, res);
                break;
            case 'GET':
                todoEngine.showItems(res);
                break;
            case 'PUT':
                todoEngine.updateItem(req, res);
                break;
            case 'DELETE':
                todoEngine.deleteItem(req, res);
                break;
            default:
                badRequest(res);
        }
    } else {
        notFound(res);
    }
});

function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}

server.listen(8888);