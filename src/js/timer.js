import GameLogic from "./game";

class TimerClass {
    constructor() {
        this.timerTag = document.querySelector('.timer');
        this.timerContent = document.querySelector('.timer__number');
        this.timerDelay = 0;
    }

    startTimer(delay) {
        this.timerDelay = delay;
        this.timerContent.textContent = delay;
        this.timerTag.style.display = 'flex';
        this.timerId = setTimeout(this.tick, 1000);
    }

    tick() {
        Timer.timerDelay--;
        if (Timer.timerContent) Timer.timerContent.textContent = Timer.timerDelay;
        if (Timer.timerDelay <= 0) {
            Timer.removeTimer();
            Timer.timerId = setTimeout(GameLogic.gameInProcess, 1000);
            return;
        }
        Timer.timerId = setTimeout(Timer.tick, 1000);
    }

    removeTimer() {
        clearTimeout(this.timerId);
        this.timerTag.style.display = 'none';
        this.timerDelay = 0;
    }
}

const Timer = new TimerClass();

export default Timer;