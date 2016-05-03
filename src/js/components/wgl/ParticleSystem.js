import THREE from 'three'
require('./libs/CSS3DRenderer');
import Particle from './Particle'

const ParticleNum = 50;

export default class ParticleSystem {
    constructor( scene ) {

        this.particles = [];

        for (var i = 0; i < ParticleNum; i++ ) {

            var p = new Particle();

            scene.add( p );

            this.particles.push( p );
        }

    }
    update() {

        for (var i = 0; i < ParticleNum; i++) {

            var p = this.particles[i];
            p.update();

        }

    }
}
