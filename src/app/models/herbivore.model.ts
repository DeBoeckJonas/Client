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

    //voor herbivoor aan te maken worden waarden toegekend, positie gezet en dan toegevoegd aan scene, return this toegevoegd voor eventuele method chaining
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
    //bij bewegen wordt cube verwijderd van grid, nieuwe positie toegevoegd en dan weer geplaatst
    move(scene:THREE.Scene){
        scene.remove(this.entityCube);
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.6, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
    }

    get id() {
        return this.#id;
    }
    //update behandeld honger logica, elke beurt -1 honger en als deze op 0 staat sterft entity
    update() : void {
        this.hunger -= 1;
        if(this.hunger <= 0) {
            this.die();
        }
    }
    //bij sterven wordt gechecked, bestaat de entity nog op de scene via .parent zodat geen entity probeert te verwijderen die er niet meer is
    die() : void {
        if (this.entityCube.parent) {
            this.entityCube.parent.remove(this.entityCube);
        }
        console.log(`Herbivore ${this.id} has died`);
    }
    //eet logica, honger wordt weer volledig en +1 reproduction bij
    eat() : void {
        this.hunger = 20;
        this.reproduction += 1;
    }
    //bij reproductie wordt deze naar 0 gezet
    reproduce() {
        this.reproduction = 0;
        console.log(`Herbivore ${this.id} born`);
    }
}
