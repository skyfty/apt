/* jshint esversion: 6 */
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let camera, scene, renderer;
let plane;
let pointer, raycaster, isShiftDown = false;

let rollOverMesh, rollOverMaterial;
let cubeGeo, cubeMaterial;

const objects = [];


export default class PanelCard {

    constructor(name) {

        let container = document.getElementById(name);
        const width = container.offsetWidth; //宽度
        const height = container.offsetHeight; //高度

        camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000);
         camera.position.set( 4.25, 1.4, - 4.5 );


        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x333333 );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
        renderer.setAnimationLoop( render );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.85;
        container.appendChild( renderer.domElement );


        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ffff, //设置材质颜色
            transparent: true,//开启透明
            opacity: 0.5,//设置透明度
        });
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );


        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {
            renderer.render(scene, camera); //执行渲染操作
        });//监听鼠标、键盘事件

        function onWindowResize() {
            const width = container.offsetWidth; //宽度
            const height = container.offsetHeight; //高度
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize( width, height );

            render();

        }



        function render() {

            renderer.render( scene, camera );

        }


        //

        window.addEventListener( 'resize', onWindowResize );

        render();

    }


}

window.PanelCard =  PanelCard;
