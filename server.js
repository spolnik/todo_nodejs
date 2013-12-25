var http = require('http');
var TodoEngine = require('./lib/todo_engine');

var todoEngine = new TodoEngine();

var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            todoEngine.processAddItemReq(req, res);
            break;
        case 'GET':
            todoEngine.processGetItemsReq(res);
            break;
        case 'PUT':
            todoEngine.processUpdateItemReq(req, res);
            break;
        case 'DELETE':
            todoEngine.processDeleteItemReq(req, res);
            break;
    }
});

server.listen(8888);