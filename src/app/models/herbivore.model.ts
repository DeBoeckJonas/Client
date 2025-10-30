import * as THREE from 'three';
import { AnimalModel } from './animal.model';


export class Herbivore extends AnimalModel {

    static #lastId = 0;

    
    constructor(x:number, z:number) {
        super(x,z)
        this.id = Herbivore.#lastId++;
        this.maxHunger=20;
        this.height=0.6;
        this.color=0x0000FF;
    }

}
