"use strict";
var Express = require("express");
var ZipLocal = require("zip-local");
var FileSystem = require("fs");
var HotSwap_1 = require("./HotSwap");
var io = require("socket.io");
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
var HServer = (function () {
    function HServer() {
        var _this = this;
        this.defineRoot = function () {
            _this.app.get('/', function (req, res) {
                res.send('Server running sucessfully');
            });
        };
        this.defineVersion = function () {
            _this.app.get('/version', function (req, res) {
                res.setHeader('Content-type', 'application/json');
                res.send('{"version": ' + _this.hotswap.getVersion() + '}');
            });
        };
        this.compileZip = function () {
            _this.app.get('/update/app.zip', function (req, res) {
                var file = __dirname + '/app.zip'; //fully qualified path name of zip file
                ZipLocal.sync.zip("./client").compress().save("./dist/app.zip");
                res.setHeader('Content-disposition', 'attachment; filename=app.zip');
                res.setHeader('Content-type', 'application/zip');
                // res.send(file);
                var filestream = FileSystem.createReadStream(file); //read from disk to memory of server(RAM)
                filestream.pipe(res); //via ram from disk to client
                FileSystem.unlink("./dist/app.zip"); //deletes file from server
            });
        };
        this.defineRoutes = function () {
            _this.defineRoot();
            _this.defineVersion();
            _this.compileZip();
            _this.buildVersion();
        };
        this.buildVersion = function () {
            var that = _this;
            _this.app.get('/buildversion', function (req, res) {
                that.hotswap.buildVersion();
                res.send('done');
            });
        };
        this.startServer = function () {
            var that = _this;
            _this.myio = io().listen(_this.app.listen(3000));
            console.log("App started at http://localhost:3000");
            _this.myio.on('connection', function (socket) {
                that.hotswap.setSocket(socket);
            });
            // this.http.listen(3000, function () {
            //     console.log('server running at 3000');
            // });
            // this.server = this.app.listen(3000, () => {
            //     console.log('App listening on port 3000!');
            // });
        };
        this.app = Express();
        this.app.use(Express.static(__dirname));
        this.defineRoutes();
        this.hotswap = new HotSwap_1.HotSwap();
        this.hotswap.hotSwapWatch();
        this.compileZip();
    }
    return HServer;
}());
exports.HServer = HServer;
