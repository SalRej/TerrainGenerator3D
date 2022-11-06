import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import createNoiseMap from './scripts/createNoiseMap';
import setSkyBox from './scripts/setSkyBox';
import setLight from './scripts/setLight';
import djikstra from './scripts/djikstra';
import colorPath from './scripts/colorPath';
import resetMapColor from './scripts/resetMapColor';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set( 0, 70, 10);
camera.lookAt( 0, 0, 0 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );      
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();


setLight(scene)
// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
// scene.add( pointLightHelper );
setSkyBox(scene);

//gui for map generation control
const scale ={s:70};
const octaves = {o:4};
const persistance ={p:0.5};
const lacunarity = {l:2};

const worldData = createNoiseMap(300,300,scale.s,octaves.o,persistance.p,lacunarity.l,scene,camera,renderer);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let pathData = [];
let vizualizingMesh;
let pathMesh;

function onPointerMove( event ) {
  
  // calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(pointer,camera);
  
  const intersect = raycaster.intersectObjects(scene.children);
  // resetMapColor(path,scene);
  pathData= djikstra(worldData.graph,0,worldData.graph[intersect[0].faceIndex].id);
  
  const vizualizingMeshGeometry = new THREE.BufferGeometry();
  vizualizingMeshGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pathData.vizualizingGeometry, 3 ));
  vizualizingMeshGeometry.computeVertexNormals();//needed for light to work
  
  const vizualizingMeshMaterial = new THREE.MeshStandardMaterial( {
    side: THREE.DoubleSide,color:0xff0000
  });

  vizualizingMesh = new THREE.Mesh( vizualizingMeshGeometry, vizualizingMeshMaterial );
  vizualizingMesh.name = "vizualizingMesh";

  const pathGeometry = new THREE.BufferGeometry();
  pathGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( pathData.path, 3 ));
  pathGeometry.computeVertexNormals();//needed for light to work
  
  const pathMaterial = new THREE.MeshStandardMaterial( {
    side: THREE.DoubleSide,color:0xff0000
  });

  pathMesh = new THREE.Mesh( pathGeometry, pathMaterial );
  pathMesh.name = "pathMesh";

  pathMesh.geometry.setDrawRange(0,pathDrawRange);
  scene.add(vizualizingMesh);
  scene.add(pathMesh);

  scene.children[3].geometry.getAttribute('color').needsUpdate=true;
  // console.log(scene)
  // console.log(mesh.geometry.attributes.position.array.length)
}
window.addEventListener( 'mousedown', onPointerMove );


let vizualizeMeshDrawRange = 0;
let pathDrawRange = 0;
// draw range


function animate() {
  requestAnimationFrame( animate );
  controls.update();
  renderer.render( scene, camera );

  //vizualize the pathfinding
  if(pathData.vizualizingGeometry!=undefined){

    //vizualize the nodes visited by the djikstra algorithm in order
    if(vizualizeMeshDrawRange <= vizualizingMesh.geometry.attributes.position.array.length/3){

      vizualizingMesh.geometry.setDrawRange( 0, vizualizeMeshDrawRange );
      vizualizingMesh.geometry.attributes.position.needsUpdate = true;
      vizualizeMeshDrawRange+=300;

    }else{
      // vizualize the path
      scene.remove(scene.getObjectByName("vizualizingMesh"));
      if(pathDrawRange<=pathMesh.geometry.attributes.position.array.length/3){
        console.log(pathDrawRange)
        pathMesh.geometry.setDrawRange(0,pathDrawRange);
        pathMesh.geometry.attributes.position.needsUpdate=true;
        pathDrawRange+=5;
      }
    }
  }

};

animate();