import * as THREE from "three";
import { EntityModel } from "./entity.model";

//model voor dieren, zodat methods konden gemaakt worden
export class AnimalModel implements EntityModel{
  gridsize!: number;
  entityCube!: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>;
  xCoord!: number;
  zCoord!: number;
  id!: number;
  reproduction!: number;
  hunger!: number;
  constructor(x:number, z:number) {
          this.xCoord = x;
          this.zCoord = z;
      }
  createEntity(scene: THREE.Scene): void {
  }
  update():void {};
  die(): void {};
  eat(): void {};
  reproduce(): void {};
  move(scene: THREE.Scene): void {};
}
