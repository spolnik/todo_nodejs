var url = require('url');
var fs = require('fs');
var qs = require('querystring');

var TodoEngine = function() {
    this.items = [];
};

function formatHtml(tmpl, items, res) {
    var html = tmpl.replace('%', items.map(function(item) {
        return '<li>' + item + '</li>'
    }).join(''));
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Length': Buffer.byteLength(html)
    });
    res.end(html);
}

TodoEngine.prototype.addItem = function (req, res) {
    var body = '';
    req.setEncoding('utf8');

    req.on('data', function (chunk) {
        body += chunk;
    });

    var that = this;
    req.on('end', function () {
        var obj = qs.parse(body);
        that.items.push(obj.item);
        that.showItems(res);
    });
};

TodoEngine.prototype.showItems = function (res) {
    var items = this.items;

    fs.readFile('./public/index.html', function (err, data) {
        if (err) {
            console.error(err);
            res.end('Server error.');
        } else {
            formatHtml(data.toString(), items, res);
        }
    });
};

TodoEngine.prototype.updateItem = function (req, res) {
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

TodoEngine.prototype.deleteItem = function(req, res) {
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