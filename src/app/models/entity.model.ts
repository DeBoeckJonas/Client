import * as THREE from 'three';

export class EntityModel {
  gridsize!:number;
      entityCube!: THREE.Mesh;
      static #lastId:number;
      xCoord!:number;
      zCoord!:number;

  
      constructor(x:number, z:number) {
          this.xCoord = x;
          this.zCoord = z;
      }
      createEntity(scene:THREE.Scene){}

}
