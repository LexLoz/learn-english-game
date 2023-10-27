import { print } from "./util";

class Statistics {
    constructor() {
        this.storage = localStorage.js_project_game || {};
        localStorage.js_project_game = this.storage;
    }

    clearStat() {
        localStorage.clear();
    }

    writeStat(name, obj) {
        
    }
}

const Stat = new Statistics();

export default Stat;