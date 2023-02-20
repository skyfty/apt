import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';
let container;
let camera, scene, renderer;
let controls, group;
let enableSelection = false;

const objects = [];

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

export default class PanelCard {

    constructor(name) {
        container = document.getElementById(name);


        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );


        const aspectRatio =  window.innerWidth / window.innerHeight
        camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 1, 100)
        camera.position.set(2, 2, 2);
        scene.add( camera );


        scene.add( new THREE.AmbientLight( 0x505050 ) );

        const light = new THREE.SpotLight( 0xffffff, 1.5 );
        light.position.set( 0, 500, 2000 );
        light.angle = Math.PI / 9;

        light.castShadow = true;
        light.shadow.camera.near = 1000;
        light.shadow.camera.far = 4000;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        scene.add( light );

        group = new THREE.Group();
        scene.add( group );

        const geometry = new THREE.BoxGeometry( 40, 40, 40 );

        for ( let i = 0; i < 10; i ++ ) {

            const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

            object.position.x = Math.random() * 1000 - 500;
            object.position.y = Math.random() * 600 - 300;
            object.position.z = Math.random() * 800 - 400;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.x = Math.random() * 2 + 1;
            object.scale.y = Math.random() * 2 + 1;
            object.scale.z = Math.random() * 2 + 1;

            object.castShadow = true;
            object.receiveShadow = true;

            scene.add( object );

            objects.push( object );

        }

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        container.appendChild( renderer.domElement );

        controls = new DragControls( [ ... objects ], camera, renderer.domElement );
        controls.addEventListener( 'drag', this.render );

        //

        window.addEventListener( 'resize', this.onWindowResize );

        // document.addEventListener( 'click', onClick );
        // window.addEventListener( 'keydown', onKeyDown );
        // window.addEventListener( 'keyup', onKeyUp );

        this.render();

    }

    onWindowResize() {
        //
        // camera.aspect = window.innerWidth / window.innerHeight;
        // camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        this.render();
    }




    render() {

        renderer.render(scene, camera);

    }


}

window.PanelCard =  PanelCard;
