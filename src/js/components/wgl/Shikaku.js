import THREE from 'three'
import TWEEN from 'tween.js'
import $ from 'jquery'

import './libs/CSS3DRenderer'

import ParticleSystem from './ParticleSystem'
import data from '../../data'
import ShikakuData from './ShikakuData'
import ArtistData from './ArtistData'
import isMobile from '../../isMobile'
import initGame from './SoundGame'

/* 環境依存 */
var dir = data.dir.test;

var scene, camera, renderer;
var controls;

var particleSystem;
var faces = [];
var artistPageArray = [];

var bModalOpen = false;

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

        window.addEventListener('resize', this.onWindowResize, false);

        animate();
    }

    onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        camera.lookAt(scene.position);

        centeringModal();
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

        // 子ページは除外してトップレベルのページを取得
        $.getJSON(dir + "wp-json/wp/v2/pages?filter[post_parent]=0", data)
        .done((result)=>{

            for (var i = 0; i < s.length; i++) {

                switch ( s[i].slug ) {
                    case "artist":
                        this.getArtistPages();
                        continue;
                        break;
                    case "info":
                        this.getPosts();
                        continue;
                        break;
                    case "special":
                        continue;
                        break;
                }

                var o = result.filter((item, index) => {
                    if (item.slug == s[i].slug) return true;
                })[0];

                if (o) document.getElementById(s[i].slug).innerHTML = o.content.rendered;
            }

        })
        .fail(()=>{
            // this.getPages();
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

            var parent = document.getElementById('info');

            for (var i = 0; i < result.length; i++) {

                parent.appendChild( this.createPostArticle(result[i]) );

            }

        })
        .fail(()=>{

        });
    }

    createPostArticle( obj ) {

        var e = document.createElement('div');
        e.className = "info-article";
        e.id = "article_" + obj.id;

        var ex = document.createElement('div');
        ex.className = "info-article-excerpt";
        ex.innerHTML = obj.excerpt.rendered;
        e.appendChild( ex );

        var d = document.createElement('div');
        d.className = "info-article-date";
        var date = new Date( obj.date );
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        d.textContent = year + " / " + month + " / " + day;
        e.appendChild( d );

        var t = document.createElement('div');
        t.className = "info-article-title";
        t.textContent = obj.title.rendered;
        e.appendChild( t );
        t.addEventListener('click', ()=>{

            openModal( obj );

        }, false);

        return e;
    }

    getArtistPages() {
        let d = { _wp_json_nonce: window.nonce };

        console.log('get');

        // Artist配下の固定ページを取得
        $.getJSON(dir + "wp-json/wp/v2/pages?filter[post_parent]=16", d)
        .done((result)=>{

            console.log(result);
            artistPageArray = result;

            this.createArtistPage();

        })
        .fail(()=>{

        });
    }

    createArtistPage() {

        let e = document.getElementById('artist');
        let m = ArtistData.management;
        let r = ArtistData.release;

        for (let i = 0; i < m.length; i++) {

            e.appendChild( this.createArtistArticle('management', m[i]) );
        }

        for (let i = 0; i < r.length; i++) {

            e.appendChild( this.createArtistArticle('release', r[i]) );

        }
    }

    createArtistArticle( type, obj ) {

        let aa = document.createElement('div');
        aa.className = 'artist-artist';

        let al = document.createElement('div');
        al.classList.add('artist-label');
        al.classList.add(type);
        aa.appendChild(al);

        let img = new Image();
        img.src = obj.imgPath;
        img.className = 'artist-img';
        aa.appendChild(img);

        let n = document.createElement('div');
        n.className = 'artist-name';
        n.textContent = obj.name;
        aa.appendChild(n);

        // aa.addEventListener();
        let o = artistPageArray.filter((item, index) => {
            if (item.slug == obj.slug) return true;
        })[0];

        aa.addEventListener('click', ()=>{

            console.log(o);
            openModal(o);

        }, false);

        return aa;

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

        if (bModalOpen) closeModal();
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

function openModal( obj ) {

    bModalOpen = true;

    $("body").append('<div id="modal-overlay"></div>');

    createModalContent(obj);

    $("#modal-overlay").fadeIn("slow");
    $("#modal").fadeIn("slow");

    centeringModal();

    $("#modal-overlay, #modal-close").unbind().click(()=>{
        closeModal();
    });
}

function closeModal() {
    $("#modal, #modal-overlay").fadeOut("slow", ()=>{
        $("#modal-overlay").remove();
        $("#modal").empty();
    });

    bModalOpen = false;
}

function createModalContent(obj) {

    let a = document.createElement('article');
    document.getElementById("modal").appendChild( a );

    let t = document.createElement('h1');
    t.className = 'modal-title';
    t.textContent = obj.title.rendered;
    a.appendChild(t);

    let d = document.createElement('time');
    let date = new Date( obj.date );
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    d.dateTime = obj.date;
    d.textContent = year + " / " + month + " / " + day;
    a.appendChild( d );

    let c = document.createElement('div');
    c.className = 'modal-content';
    c.innerHTML = obj.content.rendered;
    a.appendChild(c);

    let b = document.createElement('div');
    b.id = 'modal-close';
    b.textContent = "close";
    a.appendChild(b);

}

function centeringModal() {
    var w = $( window ).width() ;
    var h = $( window ).height() ;

    var cw = $( "#modal" ).outerWidth();
    var ch = $( "#modal" ).outerHeight();

    $( "#modal" ).css({ "left": ((w - cw)/2) + "px","top": ((h - ch)/2) + "px" });
}
