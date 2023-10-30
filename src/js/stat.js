import { print } from "./util";

const PROJECT_LOCAL_STORAGE_KEY = 'js_project_game';

class Statistics {
    constructor() {
        this.storage = localStorage.getItem(PROJECT_LOCAL_STORAGE_KEY) ? JSON.parse(localStorage.getItem(PROJECT_LOCAL_STORAGE_KEY)) : {};
    }

    clearStat() {
        localStorage.removeItem(PROJECT_LOCAL_STORAGE_KEY);
    }

    updateStorage() {
        localStorage.setItem(PROJECT_LOCAL_STORAGE_KEY, JSON.stringify(this.storage));
    }

    writeStat(index, isWin) {
        console.log('stat storage: ', this.storage);
        const previousValues = this.storage[index] || {};
        const wins = previousValues.wins || 0;
        const looses = previousValues.looses || 0;
        this.storage[index] = {wins: wins + (isWin ? 1 : 0), looses: looses + (!isWin ? 1 : 0)}
        this.updateStorage();
    }
}

const Stat = new Statistics();

export default Stat;