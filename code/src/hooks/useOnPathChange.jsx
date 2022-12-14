import {useEffect} from 'react'
import findPath from '../../scripts/graph/findPath';

import {useSelector} from 'react-redux';

function useOnPathChange() {

    const pathFindingVariables = useSelector(state => state.pathFindingVariables);
    const THREEScene = useSelector(state => state.THREEScene);
    useEffect(()=>{
        if(pathFindingVariables.isEnabled===true
            &&pathFindingVariables.startId!=-1
            &&pathFindingVariables.endId!=-1){

            const isThereAPath = findPath(pathFindingVariables,THREEScene.scene);
            if(isThereAPath===null){
                alert("No path was found");
            }
        }
    },[pathFindingVariables.startId,pathFindingVariables.endId]);
}

export default useOnPathChange