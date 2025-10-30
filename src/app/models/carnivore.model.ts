import * as THREE from "three";
import { AnimalModel } from "./animal.model";

export class Carnivore extends AnimalModel {
    static #lastId = 0;
    
    
        
    constructor(x:number, z:number) {
        super(x, z)
        this.id = Carnivore.#lastId++;
        this.maxHunger = 40;
        this.height = 0.7;
        this.color = 0xFF0000;
    }
}
