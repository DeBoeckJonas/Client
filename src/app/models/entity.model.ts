import * as THREE from 'three';

//entity model dat dieren en planten bevat, zo kunnen deze makkelijk in methodes gezet worden
export class EntityModel {
  gridsize!:number;
      entityCube!: THREE.Mesh;
      static #lastId:number;
      xCoord!:number;
      zCoord!:number;
      id!:number;

  
      constructor(x:number, z:number) {
          this.xCoord = x;
          this.zCoord = z;
      }
      createEntity(scene:THREE.Scene){}

}
