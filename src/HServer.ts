import * as Express from 'express';
import * as ZipLocal from 'zip-local';
import * as FileSystem from 'fs';
import {
    HotSwap
} from './HotSwap';

import * as http from 'http';
import * as io from 'socket.io';
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

export class HServer {
    private app: Express;
    private server;
    private hotswap: HotSwap;
    private http;
    private myio;
    private socket;
    constructor() {
        this.app = Express();
        this.app.use(Express.static(__dirname));
        this.defineRoutes();
        this.hotswap = new HotSwap();
        this.hotswap.hotSwapWatch();
        this.compileZip();
    }

    private defineRoot = () => {
        this.app.get('/', (req, res) => {
            res.send('Server running sucessfully');
        });
    }

    private defineVersion = () => {
        this.app.get('/version', (req, res) => {
            res.setHeader('Content-type', 'application/json');
            res.send('{"version": ' + this.hotswap.getVersion() + '}');
        });
    }

    private compileZip = () => {
        this.app.get('/update/app.zip', function (req, res) {
            let file = __dirname + '/app.zip'; //fully qualified path name of zip file
            ZipLocal.sync.zip("./client").compress().save("./dist/app.zip");
            res.setHeader('Content-disposition', 'attachment; filename=app.zip');
            res.setHeader('Content-type', 'application/zip');
            // res.send(file);
            let filestream = FileSystem.createReadStream(file); //read from disk to memory of server(RAM)
            filestream.pipe(res); //via ram from disk to client

            FileSystem.unlink("./dist/app.zip"); //deletes file from server
        });
    }

    private defineRoutes = () => {

        this.defineRoot();

        this.defineVersion();

        this.compileZip();

    }

    public startServer = () => {
        let that= this;
        this.myio = io().listen(this.app.listen(3000));
        this.myio.on('connection', function (socket) {
            that.hotswap.setSocket(socket);
            // socket.emit('version', {
            //     version: that.hotswap.getVersion()
            // });
        });

        // this.http.listen(3000, function () {
        //     console.log('server running at 3000');
        // });
        // this.server = this.app.listen(3000, () => {
        //     console.log('App listening on port 3000!');
        // });
    }
}