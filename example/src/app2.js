import React from 'react';
import XRPlayer from '../../src/index'; // 实际项目中使用，请使用如下方式
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
//import XRPlayer from 'react-xrplayer'
import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import EmbeddedTextBox from "../../src/display/ResourceBox/EmbeddedResource/EmbeddedTextBox";
import EmbeddedImageBox from "../../src/display/ResourceBox/EmbeddedResource/EmbeddedImageBox";
import EmbeddedVideoBox from "../../src/display/ResourceBox/EmbeddedResource/EmbeddedVideoBox";
class App extends React.Component {

    state = {
        isFullScreen: false,
        onOrientationControls: false,
        isDataReady: false,
        currentPage: 0
    }

    constructor(props) {
        super(props);
        this.xrManager = null;
        this.xrConfigure = {};
        this.hot_spot_list = [];
        this.event_list = [];
        this.model_list = [];
        this.autoDisplayList = [];

        this.maxPage = 3;
        this.eventNum = 0;

        fetch('/react-xrplayer/mock/view2.json')
            .then(res => {
                return res.json();
            })
            .then(json => {
                console.log('json', json);
                this.xrConfigure = json;
                this.setState({
                    isDataReady: true,
                });
            });
    }

    onXRCreated = (manager) => {
        this.xrManager && this.xrManager.disConnectCameraControl();
        this.xrManager = manager;
        window.xrManager = manager;
        manager.connectCameraControl();
        manager.loadConfig(this.xrConfigure[this.state.currentPage]);
        manager.setFovVerticalScope(0, 180);
        manager.enableKeyControl(true);
        manager.enableChangeFov(true);
        manager.toNormalView(0, 1000);

        if (this.state.currentPage === 1)
        {
            let scene = this.xrManager.getScene();
            let earthGeo = new THREE.SphereGeometry(5000, 100, 100);
            const texture = new THREE.TextureLoader().load( "/react-xrplayer/earth.png" );
            let earthMat = new THREE.MeshBasicMaterial();
            earthMat.map = texture;
            const sphere = new THREE.Mesh( earthGeo, earthMat );
            scene.add( sphere );
            sphere.position.set(0, -6000, 0);
            sphere.rotateY(-Math.PI * 7 / 8);
            sphere.rotateX(Math.PI * 2 / 8);
            sphere.rotateZ(-Math.PI * 3 / 8);

            let pointColor = "#ffffff";
            let directionalLight = new THREE.DirectionalLight(pointColor);
            directionalLight.position.set(-400, -100, 400);
            directionalLight.castShadow = true;
            directionalLight.intensity = 0.9;
            scene.add(directionalLight);

            let redirectionalLight = new THREE.DirectionalLight(pointColor);
            redirectionalLight.position.set(400, 100, -400);
            redirectionalLight.castShadow = true;
            redirectionalLight.intensity = 0.3;
            scene.add(redirectionalLight);

            const loader = new OBJLoader();
            loader.load(
                '/react-xrplayer/apollo-soyuz-c/apollo_soyuz_carbajal.obj',
                function ( object ) {
                    // const texture = new THREE.TextureLoader().load( "/react-xrplayer/apollo-soyuz-c/textures/sovietflag.png" );
                    // let material = new THREE.MeshBasicMaterial();
                    // material.map = texture;

                    // const material = new THREE.MeshBasicMaterial({color: 0x8f8f8f})
                    // object.children.forEach((child) => {
                    //     child.material = material;
                    // })
                    object.scale.set(7, 7, 7);
                    object.position.set(0, -80, -10);
                    scene.add( object );
                    directionalLight.target = object;
                    redirectionalLight.target = object;
                }
            );

            let ambiColor = '#212121';
            let ambientLight = new THREE.AmbientLight(ambiColor);
            scene.add(ambientLight);

            this.boxManager = this.xrManager.getEmbeddedBoxManager();
            let videoBox = new EmbeddedVideoBox('box4');
            videoBox.setVideo(process.env.PUBLIC_URL + '/page2.mp4', 1920, 1080);
            videoBox.setXYZ(0, 300, -500);
            videoBox.planeMesh.material.depthTest = true;
            // videoBox.setEnableAutoDisplay(true);
            this.boxManager.addEmbeddedBox(videoBox);

            let textBox1 = new EmbeddedTextBox('box5');
            textBox1.maxWidth = 500;
            textBox1.distance = 1000;
            textBox1.setPosition(90, 90);
            textBox1.setText('多级火箭是由数级火箭组合而成的运载工具。每一级都装有发动机与燃料，目的是为了提高火箭的连续飞行能力与最终速度。从尾部最初一级开始，每级火箭燃料用完后自动脱落，同时下一级火箭发动机开始工作，使飞行器继续加速前进。');
            textBox1.planeMesh.material.depthTest = true;
            this.boxManager.addEmbeddedBox(textBox1);

            let textBox2 = new EmbeddedTextBox('box6');
            textBox2.maxWidth = 300;
            textBox2.distance = 1000;
            textBox2.setPosition(90, -90);
            textBox2.setText('RCS(反应控制系统)是航天器在空间机动飞行用的液体火箭，为航天器的姿态调整与交会对接提供微量的调整。(即燃料箱侧面的四个小推进器)');
            textBox2.planeMesh.material.depthTest = true;
            this.boxManager.addEmbeddedBox(textBox2);
        }

        if (this.state.currentPage === 2)
        {
            let scene = this.xrManager.getScene();
            const earthR = 50;
            let earthGeo = new THREE.SphereGeometry(earthR, 100, 100);
            const earthTexture = new THREE.TextureLoader().load( "/react-xrplayer/earth.png" );
            let earthMat = new THREE.MeshBasicMaterial();
            earthMat.map = earthTexture;
            const earthSphere = new THREE.Mesh( earthGeo, earthMat );
            scene.add( earthSphere );
            earthSphere.position.set(0, 0, 0);

            let pointColor = "#ffffff";
            let directionalLight = new THREE.DirectionalLight(pointColor);
            directionalLight.position.set(-4000, -1000, 4000);
            directionalLight.castShadow = true;
            directionalLight.intensity = 0.9;
            scene.add(directionalLight);

            let redirectionalLight = new THREE.DirectionalLight(pointColor);
            redirectionalLight.position.set(4000, 1000, -4000);
            redirectionalLight.castShadow = true;
            redirectionalLight.intensity = 0.3;
            scene.add(redirectionalLight);

            let curve = new THREE.EllipseCurve(
                0,  0,            // ax, aY
                100, 100,           // xRadius, yRadius
                0,  2 * Math.PI,  // aStartAngle, aEndAngle
                false,            // aClockwise
                0                 // aRotation
            );

            let points = curve.getPoints( 500 );
            let geometry = new THREE.BufferGeometry().setFromPoints( points );
            geometry.rotateX(Math.PI / 2)
            const material = new THREE.LineBasicMaterial( { color : 0xffffff } );

            // Create the final object to add to the scene
            var ellipse = new THREE.Line( geometry, material );
            scene.add(ellipse);

            this.xrManager.cameraTweenGroup.cameraTweens[1].onUpdate = (pos) => {
                curve = new THREE.EllipseCurve(
                    0,  -pos.t * 27 / 2,            // ax, aY
                    100 + pos.t * 27 / 6, 100 + pos.t * 27 / 2,           // xRadius, yRadius
                    0,  2 * Math.PI,  // aStartAngle, aEndAngle
                    false,            // aClockwise
                    0                // aRotation
                );
                points = curve.getPoints( 500 );
                geometry = new THREE.BufferGeometry().setFromPoints( points );
                geometry.rotateX(Math.PI / 2);
                ellipse.geometry = geometry;
            };

            this.xrManager.cameraTweenGroup.cameraTweens[5].onUpdate = (pos) => {
                let ay, xR, yR;
                if (pos.t < 100)
                {
                    ay = -1350 - pos.t / 4;
                    xR = 550 - pos.t * 4;
                    yR = 1450 - pos.t / 4;
                }
                else
                {
                    pos.t -= 100;
                    ay = -3800 + pos.t * 4;
                    xR = 800 - pos.t * 3;
                    yR = 1000 - pos.t * 4;
                }

                curve = new THREE.EllipseCurve(
                    0,  ay,            // ax, aY
                    xR, yR,           // xRadius, yRadius
                    0,  2 * Math.PI,  // aStartAngle, aEndAngle
                    false,            // aClockwise
                    0                // aRotation
                );
                points = curve.getPoints( 500 );
                geometry = new THREE.BufferGeometry().setFromPoints( points );
                geometry.rotateX(Math.PI / 2);
                ellipse.geometry = geometry;
            };

            curve = new THREE.EllipseCurve(
                0,  -3000,            // ax, aY
                200, 200,           // xRadius, yRadius
                0,  2 * Math.PI,  // aStartAngle, aEndAngle
                false,            // aClockwise
                0                // aRotation
            );
            points = curve.getPoints( 500 );
            geometry = new THREE.BufferGeometry().setFromPoints( points );
            geometry.rotateX(Math.PI / 2);
            const landMaterial = new THREE.LineBasicMaterial( { color : 0x00a6ff } );
            var landEllipse = new THREE.Line( geometry, landMaterial );
            landEllipse.visible = false;
            scene.add(landEllipse);

            this.xrManager.cameraTweenGroup.cameraTweens[7].onUpdate = (pos) => {
                landEllipse.visible = true;
                curve = new THREE.EllipseCurve(
                    0,  -3000 + pos.t * 0.95,            // ax, aY
                    200 - pos.t * 7 / 4, 200 - pos.t * 0.95,           // xRadius, yRadius
                    0,  2 * Math.PI,  // aStartAngle, aEndAngle
                    false,            // aClockwise
                    0                // aRotation
                );
                points = curve.getPoints( 500 );
                geometry = new THREE.BufferGeometry().setFromPoints( points );
                geometry.rotateX(Math.PI / 2);
                landEllipse.geometry = geometry;
            };

            let moonGeo = new THREE.SphereGeometry(earthR*0.2725, 100, 100);
            const moonTexture = new THREE.TextureLoader().load( "/react-xrplayer/moon.png" );
            let moonMat = new THREE.MeshBasicMaterial();
            moonMat.map = moonTexture;
            const moonSphere = new THREE.Mesh( moonGeo, moonMat );
            scene.add( moonSphere );
            moonSphere.position.set(0, 0, -earthR*60);

            const loader = new OBJLoader();
            loader.load(
                '/react-xrplayer/apollo-soyuz-c/apollo_soyuz_carbajal.obj',
                function ( object ) {
                    // const texture = new THREE.TextureLoader().load( "/react-xrplayer/apollo-soyuz-c/textures/sovietflag.png" );
                    // let material = new THREE.MeshBasicMaterial();
                    // material.map = texture;
                    object.scale.set(1, 1, 1);
                    object.position.set(0, -11, 98);
                    scene.add( object );
                }
            );

            loader.load(
                '/react-xrplayer/apollo-soyuz-c/apollo_soyuz_carbajal.obj',
                function ( object ) {
                    // const texture = new THREE.TextureLoader().load( "/react-xrplayer/apollo-soyuz-c/textures/sovietflag.png" );
                    // let material = new THREE.MeshBasicMaterial();
                    // material.map = texture;
                    object.scale.set(0.5, 0.5, 0.5);
                    object.position.set(0, -5, -earthR*60 + 200);
                    scene.add( object );
                }
            );

            this.boxManager = this.xrManager.getEmbeddedBoxManager();
            let videoBox = new EmbeddedVideoBox('box3-1');
            videoBox.setVideo(process.env.PUBLIC_URL + '/page3/page3-1.mp4', 1920, 1080);
            videoBox.setXYZ(0, 500, -1000);
            videoBox.planeMesh.material.depthTest = true;
            videoBox.setVisible(false);
            // videoBox.setEnableAutoDisplay(true);
            this.boxManager.addEmbeddedBox(videoBox);

            videoBox = new EmbeddedVideoBox('box3-2');
            videoBox.setVideo(process.env.PUBLIC_URL + '/page3/page3-2.mp4', 1920, 1080);
            videoBox.setXYZ(0, 500, -4000);
            videoBox.planeMesh.material.depthTest = true;
            videoBox.setVisible(false);
            // videoBox.setEnableAutoDisplay(true);
            this.boxManager.addEmbeddedBox(videoBox);
        }
    }

    onCameraAnimationSet = () => {
        this.xrManager.initAudio();
        this.xrManager.setAudioSrc("http://www.tutorialrepublic.com/examples/audio/sea.mp3");

        let animateList = [
            {
                pos0: { lat: 0, lon: 180, fov: 80, distance: 100 },
                pos1: { lat: 0, lon: 0, fov: 80, distance: 100 },
                duration: 5000, easing: TWEEN.Easing.Sinusoidal.InOut,
            },
            {
                pos0: { lat: 0, lon: 0, fov: 80 },
                pos1: { lat: 0, lon: -180, fov: 80 },
                duration: 5000, easing: TWEEN.Easing.Sinusoidal.InOut,
            }
        ]
        var cameraTweenGroup = this.xrManager.createCameraTweenGroup(animateList, true);
        //cameraTweenGroup.enableAutoNext(true);
        this.xrManager.setCameraTweenGroup(cameraTweenGroup);
        // this.xrManager.onCameraAnimationEnded = (index) => {
        //     cameraTweenGroup.next();
        // }
    }

    onEventHandler = (name, props) => {
        console.log('event:', `name=${name},props:${props}`);
    }

    onChangeSenceRes = () => {
        this.xrManager.setSenceResource({
            type: 'hls',
            res_url: 'https://cache2.utovr.com/977825f316044bd6b20362be4cf39680/L2_1buy4rinqqxlqesb.m3u8'
        });
    }

    onAddHotSpot = () => {
        this.xrManager.addHotSpot({
            key: `infocard`,
            value: {
                lat: - 90, lon: -10,
                res_url: 'https://live360.oss-cn-beijing.aliyuncs.com/xr/icons/hotspot_video.png'
            }
        }, {
            key: `infocard`,
            value: {
                id: 'infocard',
                type: 'infocard',
                iframeUrl: "https://gs.ctrip.com/html5/you/place/14.html"
            }
        })
        alert(`添加了一个热点标签`)
    }

    onRemoveHotSpot = () => {
        this.xrManager.removeHotSpot('infocard')
        alert(`移除了一个热点标签`);
    }

    onAddModel = () => {
        this.xrManager.addModel('12332', {
            objUrl: "https://live360.oss-cn-beijing.aliyuncs.com/xr/models/SambaDancing.fbx",
            texture: "texture1.png",
            modeFormat: "fbx",
            scale: 1
        })
    }

    onRemoveModel = () => {
        this.xrManager.removeModel('12332');
    }

    onRemoveAllModel = () => {
        this.xrManager.removeAllModel();
    }

    onOrientationControls = () => {
        if (this.xrManager.getEnableOrientationControls()) {
            this.xrManager.disableOrientationControls();
        } else {
            this.xrManager.enableOrientationControls();
        }
    }

    onAutoRotateEnable = () => {
        const enable = this.xrManager.getEnableAutoRotate();
        this.xrManager.setEnableAutoRotate(!enable);
    }

    onAutoRotateDirection = () => {
        this.xrManager.setAutoRotateDirection('right');
    }

    onAutoRotateSpeed = () => {
        this.xrManager.setAutoRotateSpeed(10.0);
    }

    onParticleEffect = () => {
        if (this.xrManager.getEnableParticleDisplay()) {
            this.xrManager.enableParticleDisplay(false);
        } else {
            this.xrManager.enableParticleDisplay(true)
        }
    }

    onGetCameraParas = () => {
        const fov = this.xrManager.getCameraFov();
        const position = this.xrManager.getCameraPosition();
        const spherical = new THREE.Spherical();
        spherical.setFromCartesianCoords(position.x, position.y, position.z);
        var phi = spherical.phi;
        var theta = spherical.theta;
        var lon = THREE.Math.radToDeg(theta);
        var lat = THREE.Math.radToDeg(phi);
        alert(`fov:${fov}\nposition:\nx:${position.x}\ny:${position.y}\nz:${position.z}
             \nlon:${lon},lat:${lat}`)
    }

    onSetCameraParas = () => {
        this.xrManager.setCameraPosition(0, 450, 0);
        this.xrManager.setCameraFov(150);
    }

    onStartSenceVideoDisplay = () => {
        this.xrManager.startDisplaySenceResource();
    }
    onPauseSenceVideoDisplay = () => {
        this.xrManager.pauseDisplaySenceResource();
    }

    onVRControls = () => {
        this.xrManager.changeVRStatus();
    }

    onCreateTextBox = () => {
        let textBox = new EmbeddedTextBox('box1');
        // textBox.setText('helloooooooooooooooooooooo');
        textBox.setPosition(0, 0);
        this.boxManager = this.xrManager.getEmbeddedBoxManager();
        this.boxManager.addEmbeddedBox(textBox);

        let imageBox = new EmbeddedImageBox('box2');
        imageBox.setImage(process.env.PUBLIC_URL + '/logo192.png', 192, 192);
        imageBox.setPosition(0, 45);
        this.boxManager.addEmbeddedBox(imageBox);

        let videoBox = new EmbeddedVideoBox('box3');
        videoBox.setVideo(process.env.PUBLIC_URL + '/launch.mp4', 426, 240);
        console.log(process.env.PUBLIC_URL + '/launch.mp4')
        videoBox.setPosition(0, 0);
        // videoBox.setEnableAutoDisplay(true);
        this.boxManager.addEmbeddedBox(videoBox);
    }

    onChangeTextBox = () => {
        if (!!!this.boxManager) {
            alert("请先点击“创建文本框”按钮");
            return;
        }

        let textBox = this.boxManager.getEmbeddedBox('box1');
        textBox && textBox.setTextSize('large');
        textBox && textBox.setDraggable(true);
        /*textBox.onClick(() => {
            console.log("点击了标签");
        });*/
        this.xrManager.simpleSetEmbeddedBoxEvent('box1', {
            type: 'infocard',
            iframeUrl: "https://gs.ctrip.com/html5/you/place/14.html"
        });

        let imageBox = this.boxManager.getEmbeddedBox('box2');
        imageBox.setImage(process.env.PUBLIC_URL + '/logo512.png', 512, 512);
        imageBox.setDraggable(true);
        imageBox.setScale(0.3, 0.3);
        this.xrManager.simpleSetEmbeddedBoxEvent('box2', {
            type: 'image',
            imageUrl: "https://pic-cloud-bupt.oss-cn-beijing.aliyuncs.com/5c882ee6443a5.jpg",
            jumpUrl: 'http://www.youmuvideo.com',
        });

        let videoBox = this.boxManager.getEmbeddedBox('box3');
        videoBox.setVideoSize(213, 120);
        videoBox.setPosition(30, 0);
        videoBox.play();
        videoBox.setDraggable(true);
        this.xrManager.simpleSetEmbeddedBoxEvent('box3', {
            type: 'video',
            videoUrl: 'https://video-cloud-bupt.oss-cn-beijing.aliyuncs.com/hangzhou.mp4'
        });
    }

    onShowTextBox = () => {
        let boxManager = this.xrManager.getEmbeddedBoxManager();
        let boxes = [];
        let textBox = boxManager.getEmbeddedBox('box1');
        boxes.push(textBox);
        textBox = boxManager.getEmbeddedBox('box2');
        boxes.push(textBox);
        textBox = boxManager.getEmbeddedBox('box3');
        boxes.push(textBox);
        for (let textBox of boxes) {
            if (!!!textBox) {
                alert("请先点击“创建文本框”按钮");
                continue;
            }
            let visible = textBox.getVisible();
            if (!visible) {
                textBox.setVisible(true);
                this.TextBoxHidden = false;
            }
            else {
                textBox.setVisible(false);
                this.TextBoxHidden = true;
            }
        }
    }

    onRemoveTextBox = () => {
        let boxManager = this.xrManager.getEmbeddedBoxManager();
        if (!boxManager.removeEmbeddedBox('box1')) {
            alert("请先点击“创建文本框”按钮");
            return;
        }
        if (!boxManager.removeEmbeddedBox('box2')) {
            alert("请先点击“创建文本框”按钮");
            return;
        }
        if (!boxManager.removeEmbeddedBox('box3')) {
            alert("请先点击“创建文本框”按钮");
        }
    }

    onChangeTextBoxType = () => {
        let manager = this.xrManager.getEmbeddedBoxManager();
        let boxes = [];
        let boxx = manager.getEmbeddedBox('box1');
        boxes.push(boxx);
        boxx = manager.getEmbeddedBox('box2');
        boxes.push(boxx);
        boxx = manager.getEmbeddedBox('box3');
        boxes.push(boxx);
        for (let box of boxes) {
            if (!!!box) return;
            let showType = box.getShowType();
            if (showType === '2d') {
                showType = 'embed';
            }
            else {
                showType = '2d';
            }
            box.setShowType(showType);
        }
    }

    onSimpleCreateTextBox = () => {
        let simpleBox = this.xrManager.simpleCreateImageBox('textBoxSimple');
        simpleBox.setImage(process.env.PUBLIC_URL + '/logo512.png', 512, 512);
        let boxManager = this.xrManager.getEmbeddedBoxManager();
        boxManager.addEmbeddedBox(simpleBox);
    }

    onSimpleChangeTextBox = () => {
        let boxManager = this.xrManager.getEmbeddedBoxManager();
        let textBox = boxManager.getEmbeddedBox('textBoxSimple');
        if (textBox == null) {
            alert("请先点击“在相机注视位置创建文本框”按钮");
            return;
        }
        textBox.setImageSize(256, 256);
        textBox.onClick(() => {
            console.log("点击了简易标签");
        });
    }

    onPickDirector = () => {
        let pos = this.xrManager.getCameraLatLon();
        let fov = this.xrManager.getCameraFov();
        let startLat = 0, startLon = 180;
        if (this.autoDisplayList.length !== 0) {
            startLat = this.autoDisplayList[this.autoDisplayList.length - 1].end.lat;
            startLon = this.autoDisplayList[this.autoDisplayList.length - 1].end.lon;
        }
        this.autoDisplayList.push({
            start: { lat: startLat, lon: startLon, fov: 80, distance: 450 },
            end: { lat: pos.lat, lon: pos.lon, fov: fov, distance: 450 },
            duration: 5000, easing: TWEEN.Easing.Sinusoidal.InOut,
        })
        console.log(pos)
    }

    onStartAutoDisplay = () => {
        const cameraTweenGroup = this.xrManager.createCameraTweenGroup(this.autoDisplayList, true);
        this.xrManager.setCameraTweenGroup(cameraTweenGroup);
        // cameraTweenGroup.enableAutoNext(true);
        this.xrManager.startCameraTweenGroup();
    }

    nextEvent = () => {
        console.log('next event');
        console.log(this.eventNum)
        if (this.state.currentPage === 1)
        {
            let boxx = this.boxManager.getEmbeddedBox('box4');
            if (!!!this.isPlaying)
            {
                this.isPlaying = true;
                boxx.play();
                console.log('play');
            }
            else
            {
                this.isPlaying = false;
                boxx.pause();
                console.log('pause');
            }
            return;
        }
        if (this.state.currentPage === 2 && this.eventNum === 0)
        {
            if (!!!this.page3_1)
            {
                this.page3_1 = true;
                let boxx = this.boxManager.getEmbeddedBox('box3-1');
                boxx.setVisible(true);
                boxx.play();
                return;
            }
            else
            {
                this.boxManager.removeEmbeddedBox('box3-1');
            }
        }
        if (this.state.currentPage === 2 && this.eventNum === 8)
        {
            if (!!!this.page3_2)
            {
                this.page3_2 = true;
                let boxx = this.boxManager.getEmbeddedBox('box3-2');
                boxx.setVisible(true);
                boxx.play();
                return;
            }
            else
            {
                this.boxManager.removeEmbeddedBox('box3-2');
            }
        }
        if (this.eventNum === 3 && this.state.currentPage === 2)
        {
            this.xrManager.camera.target = new THREE.Vector3(0, 0, -3000);
        }
        if (this.eventNum === 4 && this.state.currentPage === 2)
        {
            this.xrManager.setFocus(new THREE.Vector3(0, 0, -50*60));
        }
        if (this.eventNum === 6 && this.state.currentPage === 2)
        {
            this.xrManager.cameraTweenGroup.cameraTweens[6].setFocus(new THREE.Vector3(0, 0, -3000));
        }
        this.eventNum++;
        if (!!!this.eventStarted)
        {
            this.eventStarted = true;
            this.xrManager.cameraTweenGroup.start();
        }
        else
            this.xrManager.cameraTweenGroup.next();
    }

    nextPage = () => {
        this.eventNum = 0;
        this.eventStarted = false;
        if(this.state.currentPage < this.maxPage - 1)
        {
            this.setState({currentPage: this.state.currentPage + 1});
        }
    }

    backFocus = () => {
        console.log('back focus')
    }

    debugFunc = () => {
        console.log('debug')
        console.log(this.xrManager.getCameraPosition())
        console.log(this.xrManager.getCameraFov())
    }

    playVideo = () => {
        let boxx = this.boxManager.getEmbeddedBox('box4')
        if (!!!this.isPlaying)
        {
            this.isPlaying = true;
            boxx.play();
            console.log('play');
        }
        else
        {
            this.isPlaying = false;
            boxx.pause();
            console.log('pause');
        }
    }

    render() {
        var xrPlayer =
            <div key={"xr"+this.state.currentPage}>
                {
                    this.state.isDataReady ?
                    <XRPlayer
                        width="100vw"
                        height="100vh"
                        camera_position={this.xrConfigure[this.state.currentPage].camera_position}
                        onCreated={this.onXRCreated}
                        scene_texture_resource={
                            this.xrConfigure[this.state.currentPage].res_urls
                        }
                        axes_helper_display={false}
                        is_full_screen={this.state.isFullScreen}
                        onFullScreenChange={(isFull) => {
                            this.setState({isFullScreen: isFull})
                        }}
                        onEventHandler={this.onEventHandler}
                    />
                    :
                    <div>加载中</div>
                }
            </div>
        return (
            <div>
                {xrPlayer}
                <div style={{ "position": "fixed", "bottom": "0" }}>
                    <button onClick={this.onStartSenceVideoDisplay}>播放</button>
                    <button onClick={this.onPauseSenceVideoDisplay}>暂停</button>
                    <button onClick={() => { this.setState({ isFullScreen: true }) }}>全屏</button>
                    <button onClick={this.onOrientationControls}>切换/取消传感器控制</button>
                    {/*<button onClick={this.onChangeSenceRes}>切换场景</button>*/}
                    {/*<button onClick={this.onAddHotSpot}>添加热点</button>*/}
                    {/*<button onClick={this.onRemoveHotSpot}>移除热点</button>*/}
                    {/*<button onClick={this.onAddModel}>添加模型</button>*/}
                    {/*<button onClick={this.onRemoveModel}>移除模型</button>*/}
                    {/*<button onClick={this.onRemoveAllModel}>移除所有模型</button>*/}
                    {/*<button onClick={this.onAutoRotateEnable}>自动旋转</button>*/}
                    {/*<button onClick={this.onAutoRotateSpeed}>自动旋转速度</button>*/}
                    {/*<button onClick={this.onAutoRotateDirection}>自动旋转方向</button>*/}
                    {/*<button onClick={this.onParticleEffect}>添加粒子效果</button>*/}
                    {/*<button onClick={this.onGetCameraParas}>获取相机参数</button>*/}
                    {/*<button onClick={this.onSetCameraParas}>重置相机初始位置</button>*/}
                    <button onClick={this.onVRControls}>进入/退出VR视角</button>
                    {/*<button onClick={this.playVideo}>播放/暂停视频</button>*/}
                    {/*<button onClick={this.onCreateTextBox}>创建文本框</button>*/}
                    {/*<button onClick={this.onShowTextBox}>显示/隐藏文本框</button>*/}
                    {/*<button onClick={this.onChangeTextBox}>修改文本框</button>*/}
                    {/*<button onClick={this.onRemoveTextBox}>移除文本框</button>*/}
                    {/*<button onClick={this.onChangeTextBoxType}>改变文本框类型</button>*/}
                    {/*<button onClick={this.onSimpleCreateTextBox}>在相机注视位置创建文本框</button>*/}
                    {/*<button onClick={this.onSimpleChangeTextBox}>修改文本框内容</button>*/}
                    {/*<button onClick={() => { this.xrManager.getAudioPaused() ? this.xrManager.playAudio() : this.xrManager.pauseAudio(); }}>播放/暂停音频</button>*/}
                    {/*<button onClick={() => { this.xrManager.getAudioVolume() === 1 ? this.xrManager.setAudioVolume(0.5) : this.xrManager.setAudioVolume(1); }}>减小音量/复原</button>*/}
                    <button onClick={() => { this.xrManager.getAudioMuted() ? this.xrManager.setAudioMuted(false) : this.xrManager.setAudioMuted(true); }}>静音/复原</button>
                    {/*<button onClick={() => { this.xrManager.replayAudio(); }}>回到开头</button>*/}
                    {/*<button onClick={() => { this.xrManager.endAudio(); }}>到达结尾</button>*/}
                    {/*<button onClick={() => { this.xrManager.startCameraTweenGroup(); }}>开始导览</button>*/}
                    {/*<button onClick={() => { this.xrManager.playCameraTweenGroup(); }}>播放</button>*/}
                    {/*<button onClick={() => { this.xrManager.pauseCameraTweenGroup() }}>暂停</button>*/}
                    {/*<button onClick={() => { this.xrManager.stopCameraTweenGroup(); }}>停止</button>*/}
                    {/*<button onClick={this.onPickDirector}>拾取导览点</button>*/}
                    {/*<button onClick={this.onStartAutoDisplay}>开始自动导览</button>*/}
                    <button onClick={this.nextEvent}>下一个事件</button>
                    <button onClick={this.nextPage}>下一页</button>
                    {/*<button onClick={this.backFocus}>回到焦点</button>*/}
                    {/*<button onClick={this.debugFunc}>debug</button>*/}
                </div>
            </div >
        )
    }
}

export default App;