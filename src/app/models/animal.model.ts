import * as THREE from "three";
import { EntityModel } from "./entity.model";

//model voor dieren, zodat methods konden gemaakt worden
export class AnimalModel extends EntityModel{
  reproduction!: number;
  hunger!: number;
  maxHunger!: number;
  gainedFromFood!: number;
  id!:number
  color!:number;
  height!:number;
  paused=false;

  update(): void {
    this.hunger--;
    if(this.hunger <=0 ) this.die();
  };
  die(): void {
    if (this.entityCube.parent) {
      this.entityCube.parent.remove(this.entityCube);
    }
  };
  eat(): void {
    this.hunger = this.maxHunger;
    this.reproduction += 1;
  };
  reproduce(): void {
    this.reproduction = 0;
  };
  move(scene: THREE.Scene): void {
    //eerst zien of er al een entitycube bestaat, anders wordt move opgeroepen op undefined en beweegt niets
    if (this.entityCube&&!this.paused){
    scene.remove(this.entityCube);
    this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.7, this.zCoord-this.gridsize/2+0.5);
    scene.add(this.entityCube);}
  };
  override createEntity(scene: THREE.Scene): void {
    if (this.height === undefined) this.height = 0.5;
    this.hunger = this.maxHunger;
    this.reproduction = 0;
    this.gridsize = 30;
    this.entityCube = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshBasicMaterial({color:this.color})
    )
    this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,this.height, this.zCoord-this.gridsize/2+0.5);
    scene.add(this.entityCube)
  }

}
