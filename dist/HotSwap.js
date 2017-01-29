"use strict";
var watch = require("node-watch");
var jsonFile = require("jsonfile");
var HotSwap = (function () {
    function HotSwap() {
        var _this = this;
        this.flag = false;
        this.buildVersion = function () {
            var that = _this;
            _this.version += 0.1;
            _this.version = parseFloat(_this.version.toFixed(1));
            jsonFile.writeFileSync('./dist/version.json', {
                version: _this.version
            });
            if (_this.socket) {
                _this.socket.emit('version', {
                    version: that.getVersion()
                });
            }
            console.log("New version built: " + _this.version);
        };
        this.filter = function (pattern, fn) {
            return function (filename) {
                if (pattern.test(filename)) {
                    fn(filename);
                }
            };
        };
        this.hotSwapWatch = function () {
            var that = _this;
            watch('./client', function (filename) {
                //toggle flag
                that.flag = that.flag ? false : true;
                if (/\.html$/.test(filename) && that.flag) {
                    that.buildVersion();
                }
                // that.buildVersion();
            });
        };
        this.getVersion = function () {
            return _this.version;
        };
        this.setSocket = function (socket) {
            _this.socket = socket;
        };
        this.version = jsonFile.readFileSync('./dist/version.json').version;
    }
    return HotSwap;
}());
exports.HotSwap = HotSwap;
