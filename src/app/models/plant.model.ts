import * as THREE from 'three';

export class Plant {

    //variabelen
    gridsize!:number;
    plantCube!: THREE.Mesh;
    static #lastId = 0;
    #id:number;
    xCoord!:number;
    zCoord!:number;

    constructor(x:number, z:number) {
        this.#id = Plant.#lastId++;
        this.xCoord = x;
        this.zCoord = z;
    }

    //plant aanmaken
    createPlant(scene:THREE.Scene):Plant{
        this.gridsize = 30;
        this.plantCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0x00ff00})
        )
        //plant in center van grid vierkant zetten, anders staat deze offcenter
        this.plantCube.position.set(this.xCoord-this.gridsize/2+0.5,0.5, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.plantCube);
        return this;
    }


    get id() {
        return this.#id;
    }
}
