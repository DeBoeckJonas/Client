import * as THREE from 'three';

//entity model dat dieren en planten bevat, zo kunnen deze makkelijk in methodes gezet worden
export class EntityModel {
    gridsize!:number;
    entityCube!: THREE.Mesh;
    xCoord!:number;
    zCoord!:number;

  
    constructor(x:number, z:number) {
        this.xCoord = x;
        this.zCoord = z;
    }
    createEntity(scene:THREE.Scene){}

}
