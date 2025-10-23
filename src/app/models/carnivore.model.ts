import * as THREE from "three";
import { AnimalModel } from "./animal.model";

export class Carnivore implements AnimalModel {
    gridsize!:number;
    entityCube!: THREE.Mesh;
    static #lastId = 0;
    #id:number;
    xCoord!:number;
    zCoord!:number;
    hunger!:number;
    reproduction!:number;
    gainedFromFood!: number;
    
        
    constructor(x:number, z:number) {
        this.#id = Carnivore.#lastId++;
        this.xCoord = x;
        this.zCoord = z;
    }
    move(scene: THREE.Scene): void {
        scene.remove(this.entityCube);
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.7, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
    }
    
    
    createEntity(scene:THREE.Scene):Carnivore{
        this.hunger = 40;
        this.reproduction = 5;
        this.gainedFromFood = 10;
        this.gridsize = 30;
        this.entityCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0xFF0000})
        )
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.7, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
        return this;
    }
    
    get id() {
        return this.#id;
    }
    
    update() : void {
        this.hunger -= 1;
        if(this.hunger <= 0) {
            this.die();
        }
    }
    die() : void {
        if (this.entityCube.parent) {
            this.entityCube.parent.remove(this.entityCube);
        }
        console.log(`Carnivore ${this.id} has died`);
    }
    
    eat() : void {
        this.hunger = 40;
        this.reproduction -= 1;
    }
    
    reproduce() {
        this.reproduction = 5;
        console.log(`Carnivore ${this.id} born`);
    }
}
