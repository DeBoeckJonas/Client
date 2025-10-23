//wat geprobeerd, collision van herbivoren lijkt mij veel, omslachtig werk, voorlopig kunnen ze in hetzelfde vakje komen (ik zie niet meteen een andere manier dan eerst het
//vakje waar ze naartoe gaan op te slaan in een array, deze te vergelijken en als er gelijke waarden zijn, nieuwe berekeningen te maken) dit als eventuele extra toevoeging later

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { Grid } from '../../models/grid.model';
import { SimulationView } from "../../components/simulation-view/simulation-view";
import { StatsPanel } from "../../components/stats-panel/stats-panel";
import { Plant } from '../../models/plant.model';
import { Herbivore } from '../../models/herbivore.model';
import { EntityModel } from '../../models/entity.model';
import { Carnivore } from '../../models/carnivore.model';
import { AnimalModel } from '../../models/animal.model';

@Component({
  selector: 'app-simulation',
  imports: [FormsModule, SimulationView, StatsPanel],
  templateUrl: './simulation.html',
  styleUrl: './simulation.css'
})
//afterviewinit voor width en height te kunnen uitlezen, geprobeerd met OnInit, maar dan kloppen de waarden niet
export class Simulation implements AfterViewInit{
  //viewchild voor reference naar DOM element in plaats van values uit te lezen, elementref is wrapper rond HTMLElement
  @ViewChild('playField') playFieldRef!: ElementRef;
  

  //variabelen
  #scene!:THREE.Scene;
  #renderer!: THREE.WebGLRenderer;
  #camera!: THREE.PerspectiveCamera;
  #grid!: Grid;
  plant!: Plant;
  plants = new Array;
  herbivore!: Herbivore;
  herbivores = new Array;
  carnivore! : Carnivore;
  carnivores = new Array;
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

  //nodig voor markForCheck
  constructor(private cdr: ChangeDetectorRef) {}
  
  //scene definieren en grid object aanmaken + toevoegen
  ngAfterViewInit(): void {
    const container = this.playFieldRef.nativeElement;
    const width = container.offsetWidth;
    const height = container.offsetHeight;

    this.#scene = new THREE.Scene();
    this.#renderer = new THREE.WebGLRenderer();
    this.#renderer.setSize(width, height);

    //camera initialiseren, grid is 30, dus 60 genomen, width/height voor correct ratio, 0.1 omdat kleinste objecten 0.1 zijn en 1000 zodat ook bij groter grid en camera distance dit zichtbaar is
    this.#camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);

    container.appendChild(this.#renderer.domElement);
    this.#scene.background = new THREE.Color(0x808080);

    this.#camera.position.z = 50;
    this.animate();

    this.#grid = new Grid();
    this.#grid.initialize();
    this.#scene.add(this.#grid.mesh);
    this.#scene.add(this.#grid.grid);

    //startwaarden -- AANPASSEN NAAR USER INPUT
    this.startAmountHerb = 5;
    this.startAmountPlants = 10;
    this.startAmountCarnivores = 1;
    this.intervalTimePlant = 2 * 1000;
    this.intervalTimeHerbivore = 3 * 1000;
    this.intervalTimeCarnivore = 2 * 1000;
    this.herbivoreSearchRange = 5;
    this.carnivoreSearchRange = 20;

    //door push wordt geen nieuwe array-referentie aangemaakt en wordt deze overgeslagen bij checks, via markforcheck wordt deze toch ook telkens gechecked door angular bij detection change cycle en update de @input automatisch
    setInterval(():void => {
      this.cdr.markForCheck();
    })

    //entities aanmaken
    this.createEntityStart(this.startAmountHerb, Herbivore, this.herbivores, this.#scene);
    this.createEntityStart(this.startAmountPlants, Plant, this.plants, this.#scene);
    this.createEntityStart(this.startAmountCarnivores, Carnivore, this.carnivores, this.#scene);
    
    

    //plant op grid plaatsen
    setInterval(():void => {
    this.createEntity(Plant, this.plants, this.#scene);
    }, this.intervalTimePlant); 

    //setinterval voor herbivoren, apart van plant voor eventueel andere seconden per game tick te gebruiken nadien
    setInterval(() => {
      this.move(Herbivore, this.herbivores, this.plants, this.herbivoreSearchRange)
    }, this.intervalTimeHerbivore);

    setInterval(() => {
      this.move(Carnivore, this.carnivores, this.herbivores, this.carnivoreSearchRange)
    }, this.intervalTimeCarnivore);

  }

  //methods

  //rendered de scene en grid
  animate = () => {
    requestAnimationFrame(this.animate);
    this.#renderer.render(this.#scene, this.#camera);
  }
  //create entity functie voor alle models
  private createEntity(entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
    let x = Math.floor(Math.random()*30);
    let z = Math.floor(Math.random()*30);     
    if(!entityArray.some(h => h.xCoord === x && h.zCoord === z)){
      const entity = new entityClass(x,z)
      entity.createEntity(scene)
      entityArray.push(entity);
    } else { console.log("spot already taken") }
  }
    
  //create entities op start
  private createEntityStart(startAmount:number, entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
    for(let i = 0; i<startAmount; i++){
      this.createEntity(entityClass, entityArray, scene)
    }
  }

  //move method
  private move(entityClass:typeof AnimalModel, entityArray:Array<AnimalModel>, targetArray: Array<EntityModel>, searchRange:number){
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
          this.#scene.remove(target.entityCube);
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
        if(entityArray === this.carnivores){
        console.log(entityArray[i].id + " + " +closestTarget?.id + " at distance " + closestTargetDistance)}

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
            entityArray[i].move(this.#scene);
            break;
          case 1 : 
            entityArray[i].xCoord = Math.max(0, entityArray[i].xCoord-1);
            entityArray[i].move(this.#scene);
            break;
          case 2 : 
            entityArray[i].zCoord =Math.min(29, entityArray[i].zCoord + 1);
            entityArray[i].move(this.#scene);
            break;
          case 3 : 
            entityArray[i].zCoord = Math.max(0, entityArray[i].zCoord-1);
            entityArray[i].move(this.#scene);
            break;
        }
        //reproductie
        if(entityArray[i].reproduction<=0){
          entityArray[i].reproduce();
          this.createEntity(entityClass, entityArray, this.#scene);
        }
      console.log(entityArray[i].id +" hunger: " + entityArray[i].hunger)
      console.log(entityArray[i].id +" reproduction: " + entityArray[i].reproduction)
    }
  }

  //geeft elementen mee aan DOM element zodat componenten deze kunnen gebruiken
  get fieldCamera(): THREE.PerspectiveCamera {
    return this.#camera;
  }

  get plantAmount(): number {
    return this.plants.length;
  }

  get herbivoreAmount(): number {
    return this.herbivores.length;
  }

  get carnivoreAmount(): number {
    return this.carnivores.length;
  }
}
