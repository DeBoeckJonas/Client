import * as THREE from 'three';
import { AnimalModel } from './animal.model';


export class Herbivore implements AnimalModel {

    //variabelen
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
        this.#id = Herbivore.#lastId++;
        this.xCoord = x;
        this.zCoord = z;
    }


    createEntity(scene:THREE.Scene):Herbivore{
        this.hunger = 20;
        this.reproduction = 0;
        this.gainedFromFood = 10;
        this.gridsize = 30;
        this.entityCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0x0000FF})
        )
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
        return this;
    }

    move(scene:THREE.Scene){
        scene.remove(this.entityCube);
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
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
        console.log(`Herbivore ${this.id} has died`);
    }

    eat() : void {
        this.hunger = 20;
        this.reproduction += 1;
    }

    reproduce() {
        this.reproduction = 0;
        console.log(`Herbivore ${this.id} born`);
    }
}
