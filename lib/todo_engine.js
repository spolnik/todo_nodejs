var url = require('url');

var TodoEngine = function() {
    this.items = [];
};

TodoEngine.prototype.processAddItemReq = function (req, res) {
    var item = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        item += chunk;
    });

    var items = this.items;
    req.on('end', function () {
        items.push(item);
        res.end('OK\n');
    });
};

TodoEngine.prototype.processGetItemsReq = function (res) {
    var body = this.items.map(function(item, i) {
        return i + ') ' + item;
    }).join('\n');

    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
    res.end(body);
};

TodoEngine.prototype.processUpdateItemReq = function (req, res) {
    var item = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        item += chunk;
    });

    var path = url.parse(req.url).pathname;
    var i = parseInt(path.slice(1), 10);

    var items = this.items;
    req.on('end', function () {
        if (isNaN(i)) {
            res.statusCode = 400;
            res.end('Invalid item id');
        } else if (!items[i]) {
            res.statusCode = 404;
            res.end('Item not found');
        } else {
            items[i] = item;
            res.end('OK\n');
        }
    });
};

TodoEngine.prototype.processDeleteItemReq = function(req, res) {
    var path = url.parse(req.url).pathname;
    var i = parseInt(path.slice(1), 10);

    if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id');
    } else if (!this.items[i]) {
        res.statusCode = 404;
        res.end('Item not found');
    } else {
        this.items.splice(i, 1);
        res.end('OK\n');
    }
};

module.exports = TodoEngine;