import { TemplateEntity } from '@angular/compiler';
import * as THREE from 'three';
import { EntityModel } from './entity.model';


export class Herbivore implements EntityModel {

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
        this.reproduction = 5;
        this.gainedFromFood = 10;
        this.gridsize = 30;
        this.entityCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0xff8c00})
        )
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
        return this;
    }

    moveHerbivore(scene:THREE.Scene){
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
        this.reproduction -= 1;
    }

    reproduce() {
        this.reproduction = 5;
        const baby = new Herbivore(Math.floor(Math.random()*30),Math.floor(Math.random()*30));
        console.log(`Herbivore ${this.id} born`);
        return baby;
    }
}
