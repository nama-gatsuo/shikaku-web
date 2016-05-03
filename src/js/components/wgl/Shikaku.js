import THREE from 'three'
import TWEEN from 'tween.js'
import $ from 'jquery'

// import './libs/TrackballControls'
import './libs/CSS3DRenderer'

import ParticleSystem from './ParticleSystem'
import data from '../../data'
import ShikakuData from './ShikakuData'
import isMobile from '../../isMobile'
import initGame from './SoundGame'

/* 環境依存 */
var dir = data.dir.test;

var scene, camera, renderer;
var controls;

var particleSystem;
var faces = [];

export default class Shikaku {
    constructor() {
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 5000);
        camera.position.set(0, 0, 2000);
        camera.lookAt( scene.position );
        scene.add( camera );

        renderer = new THREE.CSS3DRenderer({ antialias: false });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = 0;
        document.getElementById('container-gl').appendChild(renderer.domElement);

        for (var i = 0; i < ShikakuData.length; i++) {
            var o = ShikakuData[i];
            var face = this.createFace( o.slug );

            scene.add( face );

            face.position.fromArray( o.face.pos );

            face.rotation.x = o.face.rotate[0];
            face.rotation.y = o.face.rotate[1];

            faces.push(face);
        }

        this.getPages();

        if ( !(isMobile.any()) ) {
            this.ps = new ParticleSystem( scene );
            particleSystem = this.ps;
        }

        // controls
        // controls = new THREE.TrackballControls(camera, renderer.domElement);
        // controls.rotateSpeed = 0.7;
        // controls.zoomSpeed = 0.5;
        // controls.noPan = true;
        // controls.minDistance = 200;
        // controls.maxDistance = 3000;

        window.addEventListener('resize', this.onWindowResize, false);

        animate();
    }

    onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        camera.lookAt(scene.position);
    }

    createFace(slug) {

        var face = document.createElement('div');
        face.className = 'shikaku-face';

        var section = document.createElement('section');
        section.id = slug;
        face.appendChild(section);

        var obj = new THREE.CSS3DObject(face);

        return obj;
    }

    getPages() {
        var data = { _wp_json_nonce: window.nonce };
        var s = ShikakuData;

        $.getJSON(dir + "wp-json/wp/v2/pages?filter[post_parent]=0", data)
        .done((result)=>{
            console.log(result);

            for (var i = 0; i < s.length; i++) {

                if (s[i].slug == "info") {
                    this.getPosts();
                    continue;
                } else if (s[i].slug == "special") {

                    continue;
                }

                var o = result.filter((item, index) => {
                    if (item.slug == s[i].slug) return true;
                })[0];

                if (o) document.getElementById(s[i].slug).innerHTML = o.content.rendered;
            }

        })
        .fail(()=>{
            // TODO: サーバー攻撃…なので他の方法を考える
            this.getPages();
        });
    }

    getPosts( p ) {
        var data = { _wp_json_nonce: window.nonce };

        // 上位9件を1ページ分として取得。
        var filters = "filter[posts_per_page]=9" + "&";
        filters += "filter[page]=" + p + "&";
        filters += "filter[order]=DESC"
        filters += "filter[orderby]=date" + "&";
        filters += "filter[cat]=";

        // タグも設定
        $.getJSON(dir + "wp-json/wp/v2/posts?" + filters, data)
        .done((result)=>{
            console.log(result);

            var parent = document.getElementById('info');

            for (var i = 0; i < result.length; i++) {

                parent.appendChild( this.createArticle(result[i]) );

            }

        })
        .fail(()=>{

        });

    }

    createArticle( obj ) {

        var e = document.createElement('div');
        e.className = "info-article";

        var ex = document.createElement('div');
        ex.className = "info-article-excerpt";
        ex.innerHTML = obj.excerpt.rendered;
        e.appendChild( ex );

        var t = document.createElement('div');
        t.className = "info-article-title";
        t.textContent = obj.title.rendered;
        e.appendChild( t );

        var d = document.createElement('div');
        d.className = "info-article-date";
        var date = new Date( obj.date );
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        d.textContent = year + " / " + month + " / " + day;
        e.appendChild( d );

        return e;
    }

    createGame() {
        this.game = initGame();
    }

    deleteGame() {
        if (this.game) this.game.remove();
        this.game = null;
    }

    moveCamera( slug ) {

        var index;
        switch (slug) {
            case "top": index = 0; break;
            case "artist": index = 1; break;
            case "info": index = 2; break;
            case "concept": index = 3; break;
            case "special": index = 5; break;
            default: index = 0; break;
        }

        var o = ShikakuData[index].camera;

        var p = { x: o.pos[0], y: o.pos[1], z: o.pos[2] };
        var u = { x: o.up[0], y: o.up[1], z: o.up[2] };

        new TWEEN.Tween(camera.position)
            .to(p, 2000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(camera.up)
            .to(u, 1000)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
    }
}

function animate() {
    requestAnimationFrame( animate );

    if ( !(isMobile.any()) ) {
        particleSystem.update();
    }
    camera.lookAt(new THREE.Vector3(0,0,0));
    TWEEN.update();

    renderer.render( scene, camera );
}
