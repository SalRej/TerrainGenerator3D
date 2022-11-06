import * as THREE from 'three';
import mapping from './mapping';
import { DoubleSide } from 'three';
import animateWorldGeneration from './worldGeneration/animateWorldGeneration';
import generateWorld from './worldGeneration/generateWorld';
import createPoints from './createPoints';
import createNoiseValues from './createNoiseValues';

const createNoiseMap = (generationVariables,scene,doAnimate) =>{
    
    const {
        height,
        width,
        scaleY
    } = generationVariables;
    
    const mapWidth = 100;
    const mapHeight = 100;

    const sclaeMuliplayerX = width/mapWidth;
    const sclaeMuliplayerY = height/mapHeight;

    const {points , pointsOfTriangleIndexes } = createNoiseValues(generationVariables,sclaeMuliplayerX,sclaeMuliplayerY);

    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial( {
        side: THREE.DoubleSide,vertexColors: true
    });

    let graph;
    if(doAnimate===true){
        const data ={
            geometry,
            material,
            positions,
            graph,
            scene,
            width,
            height,
            points,
            pointsOfTriangleIndexes,
            colors,
            scaleY
        }
        animateWorldGeneration(data);
    }else{
        const data ={
            pointsOfTriangleIndexes,
            points,
            width,
            scene,
            geometry,
            material,
            scaleY
        }
        graph = generateWorld(data);
    }

    return graph;
}
export default createNoiseMap;