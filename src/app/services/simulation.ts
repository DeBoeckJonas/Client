import * as THREE from 'three';
import { Injectable } from '@angular/core';
import { Plant } from '../models/plant.model';
import { Herbivore } from '../models/herbivore.model';
import { Carnivore } from '../models/carnivore.model';
import { EntityModel } from '../models/entity.model';
import { AnimalModel } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  startAmountHerb!: number;
  startAmountPlants!: number;
  startAmountCarnivores!: number;
  herbivoreSearchRange!: number;
  carnivoreSearchRange!: number;
  x!: number;
  z!: number;
  intervalTimePlant!: number;
  intervalTimeHerbivore!: number;
  intervalTimeCarnivore!: number;
  plant!: Plant;
  plants = new Array;
  herbivore!: Herbivore;
  herbivores = new Array;
  carnivore! : Carnivore;
  carnivores = new Array;

  constructor() {
    this.startAmountHerb = 5;
    this.startAmountPlants = 10;
    this.startAmountCarnivores = 1;
    this.intervalTimePlant = 2000;
    this.intervalTimeHerbivore = 3000;
    this.intervalTimeCarnivore = 2000;
    this.herbivoreSearchRange = 5;
    this.carnivoreSearchRange = 20;
  }

  //intervals in method gestoken, zodat simulation view deze makkelijk kan aanroepen
  intervalCreation(scene:THREE.Scene){
  setInterval(():void => {
    this.createEntity(Plant, this.plants, scene);
    }, this.intervalTimePlant); 

    //setinterval voor herbivoren, apart van plant voor eventueel andere seconden per game tick te gebruiken nadien
    setInterval(() => {
      this.move(Herbivore, this.herbivores, this.plants, this.herbivoreSearchRange, scene)
    }, this.intervalTimeHerbivore);

    setInterval(() => {
      this.move(Carnivore, this.carnivores, this.herbivores, this.carnivoreSearchRange, scene)
    }, this.intervalTimeCarnivore);
  }
  //create entity functie voor alle models
  createEntity(entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
    let x = Math.floor(Math.random()*30);
    let z = Math.floor(Math.random()*30);     
    if(!entityArray.some(h => h.xCoord === x && h.zCoord === z)){
      const entity = new entityClass(x,z)
      entity.createEntity(scene)
      entityArray.push(entity);
    } else { console.log("spot already taken") }
  }
    
  //create entities op start
  createEntityStart(startAmount:number, entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
    for(let i = 0; i<startAmount; i++){
      this.createEntity(entityClass, entityArray, scene)
    }
  }

  //move method
  move(entityClass:typeof AnimalModel, entityArray:Array<AnimalModel>, targetArray: Array<EntityModel>, searchRange:number, scene:THREE.Scene){
    for(let i = 0; i<entityArray.length; i++){
      //honger aanpassen
      entityArray[i].update();
      if(entityArray[i].hunger <=0){
        entityArray.splice(i,1);
      }
      //eten
      const target = targetArray.find(p=>p.xCoord === entityArray[i].xCoord && p.zCoord === entityArray[i].zCoord);
      if(target ){
        entityArray[i].eat();
        scene.remove(target.entityCube);
        const index = targetArray.indexOf(target);
        targetArray.splice(index, 1);
      }
      //bewegen
      //random, anders kijk of eten in distance van 5 is
      let moveDirection = Math.floor(Math.random()*4);
      //reduce gebruikt voor dichtste doel te berekenen, via math.abs wordt de totale afstand berekend, daarna check gedaan, als closest undefined is (als startwaarde
      //opgegeven zodat niet null is), of als de distance die berekend is kleiner is dan de distance toegekend aan closest, dan wordt object gereturned dat zowel het target object als de distance bevat
      //de reduce zal deze dan in closest steken en opnieuw over de array loopen om met dezelfde condities, zodra deze heel de array over gelooped is zal de beste closest terug
      //gestuurd worden en in closestTargetWithDistance gestoken worden (ik heb geprobeerd met return closest?.target als laatste return, maar dit werkte niet, ik veronderstel
      //doordat als hij niet in de if loop terechtkomt hij dit gebruikt om opnieuw te loopen en er geen distanceTarget meer is)
      const closestTargetWithDistance = targetArray.reduce<{target: EntityModel, distanceTarget: number}|undefined>((closest, target) => {
        const distanceTarget = Math.abs(target.xCoord - entityArray[i].xCoord) + Math.abs(target.zCoord - entityArray[i].zCoord);
        if(closest === undefined || distanceTarget<closest.distanceTarget){
          return { target, distanceTarget}
        }
        return closest;
        }, undefined
      )
      
      const closestTarget = closestTargetWithDistance?.target
      const closestTargetDistance = closestTargetWithDistance?.distanceTarget;
      if (!closestTarget || closestTargetDistance === undefined) {
        continue; // or just 'return' if outside loop
      }

      //bewegingslogica voor Target in range 5
      if(closestTargetDistance<=searchRange){
        let closestX = closestTarget.xCoord-entityArray[i].xCoord;
        let closestZ = closestTarget.zCoord-entityArray[i].zCoord
        if(Math.abs(closestX)<=Math.abs(closestZ) && (closestZ)>0) {
          //z+
          moveDirection = 2;
        } else
        if(Math.abs(closestX)<=Math.abs(closestZ) && (closestZ)<0) {
          //z-
          moveDirection = 3;} 
        else
        if(Math.abs(closestX)>Math.abs(closestZ) && closestX>0) {
          //x+
          moveDirection = 0;
        } else
        if(Math.abs(closestX)>Math.abs(closestZ) && closestX<0) {
          //x-
        moveDirection = 1;
        }
      }
      switch(moveDirection){
        case 0 : 
          entityArray[i].xCoord = Math.min(29, entityArray[i].xCoord+1);
          entityArray[i].move(scene);
          break;
        case 1 : 
          entityArray[i].xCoord = Math.max(0, entityArray[i].xCoord-1);
          entityArray[i].move(scene);
          break;
        case 2 : 
          entityArray[i].zCoord =Math.min(29, entityArray[i].zCoord + 1);
          entityArray[i].move(scene);
          break;
        case 3 : 
          entityArray[i].zCoord = Math.max(0, entityArray[i].zCoord-1);
          entityArray[i].move(scene);
          break;
      }
      //reproductie
      if(entityArray[i].reproduction<=0){
        entityArray[i].reproduce();
        this.createEntity(entityClass, entityArray, scene);
      }
    }
  }
}
