import * as watch from 'node-watch';
import * as jsonFile from 'jsonfile';

export class HotSwap {
    private version: number;
    private flag: boolean = false;
    private socket;
    constructor() {
        this.version = jsonFile.readFileSync('./dist/version.json').version;
    }
    
    public buildVersion = () => {
        let that = this
        this.version += 0.1;
        this.version = parseFloat(this.version.toFixed(1));
        jsonFile.writeFileSync('./dist/version.json', {
            version: this.version
        });
        if (this.socket) {
            this.socket.emit('version', {
                version: that.getVersion()
            });
        }
        console.log("New version built: " + this.version);
    }

    private filter = (pattern, fn) => {
        return function (filename) {
            if (pattern.test(filename)) {
                fn(filename);
            }
        }
    }

    public hotSwapWatch = () => {
        let that = this;
        watch('./client', (filename) => {
            //toggle flag
            that.flag = that.flag ? false : true;
            if (/\.html$/.test(filename) && that.flag) {
                that.buildVersion();
            }
        });
    }

    public getVersion = (): number => {
        return this.version;
    }

    public setSocket = (socket)=>{
        this.socket = socket;
    }
}