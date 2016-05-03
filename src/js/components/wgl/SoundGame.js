import P5 from "p5"

/* 環境依存 */
var audioPath = '/test/wp-content/themes/shikaku/asset/audio/'

var s = (p) => {
    let gameObj = {
        on_of: [],
        sound: [],
        pos: [],
        currentBeat: 0,
        pause: true
    };

    const wNum = 16, hNum = 16;
    const objNum = wNum * hNum;
    const rSize = 60;

    p.preload = () => {
        for (var i = 0; i < 16; i++) {

            var a = p.loadSound(audioPath + i + ".mp3");

            gameObj.sound.push(a);
        }
    }

    p.setup = () => {
        p.createCanvas(960, 960).parent('special');

        p.background(255, 0);

        p.frameRate(15);

        for (var i = 0; i < hNum; i++) {

            for (var j = 0; j < wNum; j++) {
                var b = 0;
                gameObj.on_of.push( b );

                var x = j * rSize;
                var y = i * rSize;
                gameObj.pos.push([ x, y ]);
            }

        }
        gameObj.sound.currentBeat = 0;

        p.setListners();
    };

    p.draw = () => {

        p.clear();

        p.fill(255, 231, 242);
        p.rect(gameObj.currentBeat * rSize, 0, rSize, rSize * 16);

        p.stroke(196);
        for (var i = 0; i < wNum; i ++) {
            p.line(i * rSize, 0, i * rSize, 960);
        }

        for (var i = 0; i < hNum; i ++) {
            p.line(0, i * rSize, 960, i * rSize);
        }

        p.fill(255, 219, 222);
        for (var i = 0; i < objNum; i++) {
            if (gameObj.on_of[i]) {
                p.rect(gameObj.pos[i][0], gameObj.pos[i][1], rSize, rSize);
            }
        }

    };

    p.setListners = () => {

        document.getElementById('game-pause').addEventListener('click', p.pauseGame, false);

        document.getElementById('game-play').addEventListener('click', p.playGame, false);

        document.getElementById('game-resset').addEventListener('click', p.ressetGame, false);

    };

    p.mousePressed = () => {

        var d = window.innerHeight * 0.77 * 0.0625;

        var x = Math.floor( p.mouseX / d );
        var y = Math.floor( p.mouseY / d );

        if (x > 15 || x < 0 || y > 15 || y < 0) return;

        var i = y * 16 + x;

        if (gameObj.on_of[i]) {
            gameObj.on_of[i] = 0;
        } else {
            gameObj.on_of[i] = 1;
        }
    };

    p.updateSequencer = () => {

        setTimeout(()=>{
            gameObj.currentBeat += 1;

            if (gameObj.currentBeat == 16) gameObj.currentBeat = 0;
            if (gameObj.pause) return;

            p.bang( gameObj.currentBeat );
            p.updateSequencer();

        }, 125);
    };

    p.bang = (beatNum) => {

        for (var i = 0; i < 16; i++) {
            var index = i * 16 + beatNum;
            if (gameObj.on_of[index]) gameObj.sound[i].play();
        }

    }

    p.ressetGame = () => {

        for (var i = 0; i < objNum; i++) {
            gameObj.on_of[i] = 0;
        }

        p.pauseGame();
        gameObj.currentBeat = 0;
    };

    p.playGame = () => {
        gameObj.pause = false;
        p.updateSequencer();
    };

    p.pauseGame = () => {
        gameObj.pause = true;
    };

}

export default function initGame() {
    return new P5(s);
};
