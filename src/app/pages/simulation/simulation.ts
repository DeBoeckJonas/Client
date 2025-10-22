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
  startAmountHerb!: number;
  startAmountPlants!: number;
  herbivoreSearchRange!: number;
  x!: number;
  z!: number;
  intervalTimePlant!: number;
  intervalTimeHerbivore!: number;

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
    this.startAmountHerb = 3;
    this.startAmountPlants = 10;
    this.intervalTimePlant = 2 * 1000;
    this.intervalTimeHerbivore = 3 * 1000;

    //door push wordt geen nieuwe array-referentie aangemaakt en wordt deze overgeslagen bij checks, via markforcheck wordt deze toch ook telkens gechecked door angular bij detection change cycle en update de @input automatisch
    setInterval(():void => {
      this.cdr.markForCheck();
    })

    //create entity functie voor alle models
    function createEntity(entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
      let x = Math.floor(Math.random()*30);
      let z = Math.floor(Math.random()*30);     
      if(!entityArray.some(h => h.xCoord === x && h.zCoord === z)){
        const entity = new entityClass(x,z)
        entity.createEntity(scene)
        entityArray.push(entity);
      } else { console.log("spot already taken") }
    }
    
    //create entities op start
    function createEntityStart(startAmount:number, entityClass:typeof EntityModel, entityArray:Array<EntityModel>, scene:THREE.Scene){
      for(let i = 0; i<startAmount; i++){
        createEntity(entityClass, entityArray, scene)
      }
    }

    //entities aanmaken
    createEntityStart(this.startAmountHerb, Herbivore, this.herbivores, this.#scene);
    createEntityStart(this.startAmountPlants, Plant, this.plants, this.#scene);

    //plant op grid plaatsen
    setInterval(():void => {
    createEntity(Plant, this.plants, this.#scene);
    }, this.intervalTimePlant); 

    //setinterval voor herbivoren, apart van plant voor eventueel andere seconden per game tick te gebruiken nadien
    setInterval(() => {
      for(let i = 0; i<this.herbivores.length; i++){
        //honger aanpassen
        this.herbivores[i].update();
        if(this.herbivores[i].hunger <=0){
          this.herbivores.splice(i,1);
        }
        //eten
        const plant = this.plants.find(p=>p.xCoord === this.herbivores[i].xCoord && p.zCoord === this.herbivores[i].zCoord);
        if(plant ){
          this.herbivores[i].eat();
          this.#scene.remove(plant.entityCube);
          this.plants = this.plants.filter(p => p !== plant);
        }
        //bewegen
        //random, anders kijk of eten in distance van 5 is, verkies z richting
        let moveDirection = Math.floor(Math.random()*4);
        //reduce gebruikt voor dichtste plant te berekenen, via math.abs wordt de totale afstand berekend, daarna check gedaan, als closest undefined is (als startwaarde
        //opgegeven zodat niet null is), of als de distance die berekend is kleiner is dan de distance toegekend aan closest, dan wordt object gereturned dat zowel het plant object als de distance bevat
        //de reduce zal deze dan in closest steken en opnieuw over de array loopen om met dezelfde condities, zodra deze heel de array over gelooped is zal de beste closest terug
        //gestuurd worden en in closestPlantWithDistance gestoken worden (ik heb geprobeerd met return closest?.plant als laatste return, maar dit werkte niet, ik veronderstel
        //doordat als hij niet in de if loop terechtkomt hij dit gebruikt om opnieuw te loopen en er geen distancePlant meer is)
        const closestPlantWithDistance = this.plants.reduce((closest, plant) => {
          const distancePlant = Math.abs(plant.xCoord - this.herbivores[i].xCoord) + Math.abs(plant.zCoord - this.herbivores[i].zCoord);
          if(closest === undefined || distancePlant<closest.distancePlant){
            return { plant, distancePlant}
          }
          return closest;
          }, undefined
        )
        const closestPlant = closestPlantWithDistance?.plant
        const closestPlantDistance = closestPlantWithDistance?.distancePlant;
        console.log(this.herbivores[i].id + " + " +closestPlant.id + " at distance " + closestPlantDistance)

        //SEARCH RANGE NOG USER INPUT
        this.herbivoreSearchRange = 5;
        if(closestPlantDistance<=this.herbivoreSearchRange){
          if(Math.abs(closestPlant.xCoord-this.herbivores[i].xCoord)<=Math.abs(closestPlant.zCoord-this.herbivores[i].zCoord) && (closestPlant.zCoord-this.herbivores[i].zCoord)>0) {
            //z+
            moveDirection = 2;
          } else
          if(Math.abs(closestPlant.xCoord-this.herbivores[i].xCoord)<=Math.abs(closestPlant.zCoord-this.herbivores[i].zCoord) && (closestPlant.zCoord-this.herbivores[i].zCoord)<0) {
            //z-
            moveDirection = 3;} 
          else
          if(Math.abs(closestPlant.xCoord-this.herbivores[i].xCoord)>Math.abs(closestPlant.zCoord-this.herbivores[i].zCoord) && (closestPlant.xCoord-this.herbivores[i].xCoord)>0) {
            //x+
            moveDirection = 0;
          } else
          if(Math.abs(closestPlant.xCoord-this.herbivores[i].xCoord)>Math.abs(closestPlant.zCoord-this.herbivores[i].zCoord) && (closestPlant.xCoord-this.herbivores[i].xCoord)<0) {
            //x-
            moveDirection = 1;
          }
        }
        switch(moveDirection){
          case 0 : 
            this.herbivores[i].xCoord = Math.min(29, this.herbivores[i].xCoord+1);
            this.herbivores[i].moveHerbivore(this.#scene);
            break;
          case 1 : 
            this.herbivores[i].xCoord = Math.max(0, this.herbivores[i].xCoord-1);
            this.herbivores[i].moveHerbivore(this.#scene);
            break;
          case 2 : 
            this.herbivores[i].zCoord =Math.min(29, this.herbivores[i].zCoord + 1);
            this.herbivores[i].moveHerbivore(this.#scene);
            break;
          case 3 : 
            this.herbivores[i].zCoord = Math.max(0, this.herbivores[i].zCoord-1);
            this.herbivores[i].moveHerbivore(this.#scene);
            break;
        }
        //reproductie
        if(this.herbivores[i].reproduction<=0){
          this.herbivore = this.herbivores[i].reproduce();
          createEntity(Herbivore, this.herbivores, this.#scene);
        }
      console.log(this.herbivores[i].id +" hunger: " + this.herbivores[i].hunger)
      console.log(this.herbivores[i].id +" reproduction: " + this.herbivores[i].reproduction)
      }
    }, this.intervalTimeHerbivore);
  



  }
  //rendered de scene en grid
  animate = () => {
    requestAnimationFrame(this.animate);
    this.#renderer.render(this.#scene, this.#camera);
  }
  //geeft de camera mee aan DOM element zodat view deze kan gebruiken
  get fieldCamera(): THREE.PerspectiveCamera {
    return this.#camera;
  }

  get plantAmount(): number {
    return this.plants.length;
  }

  get herbivoreAmount(): number {
    return this.herbivores.length;
  }

}
