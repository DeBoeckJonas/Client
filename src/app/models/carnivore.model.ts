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
    //bij bewegen wordt cube verwijderd van grid, nieuwe positie toegevoegd en dan weer geplaatst
    move(scene: THREE.Scene): void {
        scene.remove(this.entityCube);
        this.entityCube.position.set(this.xCoord-this.gridsize/2+0.5,0.7, this.zCoord-this.gridsize/2+0.5);
        scene.add(this.entityCube);
    }
    
    //voor carnivoor aan te maken worden waarden toegekend, positie gezet en dan toegevoegd aan scene, return this toegevoegd voor eventuele method chaining
    createEntity(scene:THREE.Scene):Carnivore{
        this.hunger = 40;
        this.reproduction = 0;
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
        console.log(`Carnivore ${this.id} has died`);
    }
    //eet logica, honger wordt weer volledig en +1 reproduction bij
    eat() : void {
        this.hunger = 40;
        this.reproduction += 1;
        console.log(`Carnivore ${this.id} has eaten a herbivore`);
    }
    //bij reproductie wordt deze naar 0 gezet
    reproduce() {
        this.reproduction = 0;
        console.log(`Carnivore ${this.id} born`);
    }
}
