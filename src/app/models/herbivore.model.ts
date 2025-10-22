import * as THREE from 'three';


export class Herbivore {

    //variabelen
    gridsize!:number;
    herbCube!: THREE.Mesh;
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

    createHerbivore(scene:THREE.Scene):Herbivore{
        this.hunger = 20;
        this.reproduction = 5;
        this.gainedFromFood = 10;
        this.gridsize = 30;
        this.herbCube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({color:0xff8c00})
        )
        this.herbCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.herbCube);
        return this;
    }

    moveHerbivore(scene:THREE.Scene){
        scene.remove(this.herbCube);
        this.herbCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.herbCube);
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
        if (this.herbCube.parent) {
            this.herbCube.parent.remove(this.herbCube);
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
