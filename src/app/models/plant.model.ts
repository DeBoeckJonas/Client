import * as THREE from 'three';
import { EntityModel } from './entity.model';

export class Plant extends EntityModel{

    //variabelen

    static #lastId = 0;
    #id:number;



    constructor(x:number, z:number) {
        super(x,z)
        this.#id = Plant.#lastId++;

    }


    //plant aanmaken
    override createEntity(scene:THREE.Scene):Plant{
        this.gridsize = 30;
        this.entityCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0x00ff00})
        )
        //plant in center van grid vierkant zetten, anders staat deze offcenter
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.5, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
        return this;
    }


    get id() {
        return this.#id;
    }
}
