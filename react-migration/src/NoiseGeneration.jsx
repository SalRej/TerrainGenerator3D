import React , {useState , useEffect , useRef ,useContext } from 'react'
import NoiseGeneratorSettings from './NoiseGeneratorSettings';
import worldDataContext from './contex';
import BackButton from './BackButton';

import useTriggerControls from './hooks/useTriggerControls';

import createNoiseMap from '../scripts/noiseGeneration/createNoiseMap';
import getTriangleClicked from '../scripts/getTriangleClicked';
import findPath from '../scripts/graph/findPath';
import terraform from '../scripts/terraforming/terraform';
// import createNoiseMap from '../scripts/test/createNoiseMap';
function NoiseGeneration() {

    const canvasHolder = useRef(null);
    const initialRender = useRef(true);
    const mouseX = useRef(null);
    const mouseY = useRef(null);

    const {THREEScene ,setTHREEScene, pathFindingVariables, setPathFindingVariables, terraformingVariables} = useContext(worldDataContext);

     const [generationVariables,setGenerationVariables] = useState({
        width:100,
        height:100,
        scale:70,
        octaves:7,
        persistance:0.5,
        lacunarity:2,
        offsetX:0,
        offsetY:0,
        scaleY:20,
        seed:String(Math.floor(Math.random()*100000))
    })

    useEffect(()=>{
        
        if(canvasHolder.current!=null){
           canvasHolder.current.appendChild(THREEScene.renderer.domElement);
        }
        
        THREEScene.scene.remove(THREEScene.scene.getObjectByName('worldMesh'));
        THREEScene.scene.remove(THREEScene.scene.getObjectByName('pathMesh')); 
        const graph = createNoiseMap(generationVariables,THREEScene.scene,true);

        setPathFindingVariables({
            ...pathFindingVariables,
            graph:graph
        })

        window.addEventListener('mousemove',(event)=>{
            mouseX.current = event.clientX;
            mouseY.current = event.clientY;
        })
        animate();

    },[]);

    
    function animate() {
        requestAnimationFrame( animate );
        THREEScene.controls.update();
        THREEScene.renderer.render( THREEScene.scene, THREEScene.camera);
    };

    useTriggerControls(THREEScene,setTHREEScene,terraformingVariables);
    
    useEffect(()=>{
        if(initialRender.current==true){
            initialRender.current=false;
        }
        else if(initialRender.current==false){
            THREEScene.scene.remove(THREEScene.scene.getObjectByName('worldMesh'));
            THREEScene.scene.remove(THREEScene.scene.getObjectByName('pathMesh'));
    
            const graph = createNoiseMap(generationVariables,THREEScene.scene,false);

            setPathFindingVariables({
                startId:-1,
                endId:-1,
                isEnagled:false,
                graph:graph
            })
        }
    },[generationVariables]);

    const changeResolution = (value) =>{
        setGenerationVariables({
            ...generationVariables,
            ['width']:value,
            ['height']:value
        })
    }
    const handleNoiseSettings = (event)=>{
        setGenerationVariables({
            ...generationVariables,
            [event.target.name]:event.target.value
        })
    }

    useEffect(()=>{
        if(pathFindingVariables.isEnagled===true
            &&pathFindingVariables.startId!=-1
            &&pathFindingVariables.endId!=-1){

            const isThereAPath = findPath(pathFindingVariables,THREEScene.scene);
            if(isThereAPath===null){
                alert("No path was found");
            }
        }
    },[pathFindingVariables.startId,pathFindingVariables.endId]);


    const intervalRef = React.useRef(null);
    const startCounter = (event) => {
        
        if (intervalRef.current) return;
        if(terraformingVariables.isEnabled===false) return;

        intervalRef.current = setInterval(() => {
          const {scaleY} = generationVariables;
          const {renderer,scene,camera} = THREEScene;
          const triangleId = getTriangleClicked(mouseX.current,mouseY.current,renderer,camera,scene);

          if(event.button===0){//left button
            terraform(triangleId,THREEScene,pathFindingVariables,scaleY,true,terraformingVariables);
          }
          else if(event.button===2){//right button
            terraform(triangleId,THREEScene,pathFindingVariables,scaleY,false,terraformingVariables);
          }
          
        }, 10);
    };
    
    const stopCounter = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const canvasClicked = (event)=>{
        event.preventDefault();
        event.stopPropagation();
        if(terraformingVariables.isEnabled === true){
            return;
        }

        const {camera,renderer,scene} = THREEScene;
        const clickedFace = getTriangleClicked(mouseX.current,mouseY.current,renderer,camera,scene);

        if(clickedFace===null)
            return;
            
        if(pathFindingVariables.isEnagled===false)
            return;

        if(pathFindingVariables.graph[clickedFace].isObstical===true){
            alert("cant travel on water");
            return;
        }

        //click means left button is clicked
        if(event.type === "click"){
            setPathFindingVariables({
                ...pathFindingVariables,
                startId:clickedFace
            })
        }else if (event.type === "contextmenu"){//contexmenu means right button is clicked
            event.preventDefault();
            event.stopPropagation();
            setPathFindingVariables({
                ...pathFindingVariables,
                endId:clickedFace
            })
        }
    }

    return (
        <div className='flex'>
            <div ref={canvasHolder} className='canvas_older' onClick={canvasClicked} onContextMenu={canvasClicked}
            onMouseDown={startCounter}
            onMouseUp={stopCounter}
            ></div>
            <div className='settings_holder'>
                <BackButton url={'/'}/>
                <NoiseGeneratorSettings 
                    generationVariables={generationVariables}
                    handleNoiseSettings={handleNoiseSettings}
                    changeResolution={changeResolution}
                />
            </div>
        </div>
    )
}

export default NoiseGeneration