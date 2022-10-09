import createNode from "../createNode";
import mapping from "../mapping";
import applyColor from "../applyColor";
import * as THREE from 'three';

const generateWorld = (data) =>{
    const {
        positions,
        points,
        triangleIndexes,
        graph,
        colors,
        width,
        scene,
        geometry,
        material

    } = data;

    for(let i=0;i<triangleIndexes.length;i++){

        //3 colors for each vertex of the triangle
        let color1={r:0,g:1,b:0};
        let color2={r:0,g:1,b:0};
        let color3={r:0,g:1,b:0};

        //apply diffrent colors depending on vertex.y value
        
        let y1 = mapping(points[triangleIndexes[i].a].y,-1,1,0,20);
        let y2 = mapping(points[triangleIndexes[i].b].y,-1,1,0,20);
        let y3 = mapping(points[triangleIndexes[i].c].y,-1,1,0,20);
        
        const x1 = points[triangleIndexes[i].a].x;
        const x2 = points[triangleIndexes[i].b].x;
        const x3 = points[triangleIndexes[i].c].x;
        
        const z1 = points[triangleIndexes[i].a].z;
        const z2 = points[triangleIndexes[i].b].z;
        const z3 = points[triangleIndexes[i].c].z;
        
        if(y1<=3){
            y1=3;
        }
        if(y2<=3){
            y2=3;
        }
        if(y3<=3){
            y3=3;
        }
        
        applyColor(y1,y2,y3,color1,color2,color3);
        //push vertecies making a triangle in order
        positions.push(
            x1,y1,z1,
            x2,y2,z2,
            x3,y3,z3
        );

        colors.push(color1.r,color1.g,color1.b,color2.r,color2.g,color2.b,color3.r,color3.g,color3.b);

        const position = [x1,y1+1,z1,x2,y2+1,z2,x3,y3+1,z3];//position of each triangle with y a bit higher so the mesh is above the othe one
        //needed later for animation of pathfinding
        const avrageY = (y1+y2+y3)/3;//needet to determine cost value of each node
        createNode(graph,i,avrageY,width,position);
    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ));
    geometry.computeVertexNormals();//needed for light to work
    geometry.setAttribute('color', new THREE.Float32BufferAttribute( colors, 3 ));

    const mesh = new THREE.Mesh( geometry, material );
    mesh.name='worldMesh';
    scene.add(mesh);
}
export default generateWorld;