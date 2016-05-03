import THREE from 'three'
require('./libs/CSS3DRenderer');

export default class Particle extends THREE.CSS3DObject {
    constructor() {

        var div = document.createElement('div');
        div.className = 'particle';
        var t = Math.floor( Math.random() * 10 );
        div.textContent = t;
        div.style.fontSize = "2em";

        super(div);

        this.startPos = {
            x: Math.random() * 2000 - 1000,
            y: 1000,
            z: Math.random() * 2000 - 1000,
        };

        // this.startRot = {
        //     x: Math.random() * Math.PI,
        //     y: Math.random() * Math.PI,
        //     z: Math.random() * Math.PI,
        // };

        this.lifetime = Math.random();

        let p = this.startPos;
        let r = this.startRot;
        let py = -2000 * this.lifetime + 1000;

        this.position.set(p.x, py, p.z);
        // this.rotation.set(r.x, r.y, r.z);
    }

    update() {
        this.lifetime += 0.0005; // 2000 loop

        if (this.lifetime > 1.0) {
            this.lifetime = 0.0;

            let p = this.startPos;
            let r = this.startRot;

            this.position.set(p.x, p.y, p.z);
            this.rotation.set(0, 0, 0);

            return;
        }

        this.position.y -= 1;

        this.rotation.y += 0.02;
    }
}
