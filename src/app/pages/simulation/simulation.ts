import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { Grid } from '../../models/grid.model';
import { SimulationView } from "../../components/simulation-view/simulation-view";
import { StatsPanel } from "../../components/stats-panel/stats-panel";
import { Plant } from '../../models/plant.model';
import { Herbivore } from '../../models/herbivore.model';

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


    //aantal planten in het begin zetten
    // MOET AANGEPAST WORDEN NAAR USER INPUT
    this.startAmountPlants = 10;
    for(let i = 0; i<this.startAmountPlants; i++){
      let x = Math.floor(Math.random()*30);
      let z = Math.floor(Math.random()*30);
      if(!this.plants.some(p => p.xCoord === x && p.zCoord === z)){
        this.plant = new Plant(x , z);
        this.plant.createPlant(this.#scene);
        this.plants.push(this.plant);
      }
    }

    //plant op grid plaatsen
    setInterval(():void => {
    let x = Math.floor(Math.random()*30);
    let z = Math.floor(Math.random()*30);
    if(!this.plants.some(p => p.xCoord === x && p.zCoord === z)){
      this.plant = new Plant(x , z);
      this.plant.createPlant(this.#scene);
      this.plants.push(this.plant);

      //door push wordt geen nieuwe array-referentie aangemaakt en wordt deze overgeslagen bij checks, via markforcheck wordt deze toch ook telkens gechecked door angular bij detection change cycle en update de @input automatisch
      this.cdr.markForCheck();
    } else { console.log("spot for plant taken")}
    }, 2000);
    
    //aantal herbivoren in het begin zetten
    // MOET AANGEPAST WORDEN NAAR USER INPUT
    this.startAmountHerb = 3;
    for(let i = 0; i<this.startAmountHerb; i++){
      let x = Math.floor(Math.random()*30);
      let z = Math.floor(Math.random()*30);
      if(!this.herbivores.some(h => h.xCoord === x && h.zCoord === z)){
        this.herbivore = new Herbivore(Math.floor(Math.random()*30),Math.floor(Math.random()*30))
        this.herbivore.createHerbivore(this.#scene)
        this.herbivores.push(this.herbivore);
      }
    }

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
          this.#scene.remove(plant.plantCube);
          this.plants = this.plants.filter(p => p !== plant);
        }
        //bewegen
        //random, anders kijk of eten in distance van 5 is, verkies z richting
        let moveDirection = Math.floor(Math.random()*4);
        if(this.plants.some(p => (p.xCoord - this.herbivores[i].xCoord) === 0 && ((p.zCoord - this.herbivores[i].zCoord) <=5 && (p.zCoord - this.herbivores[i].zCoord)>0))) {
          moveDirection = 2;
        } else
        if(this.plants.some(p => (p.xCoord - this.herbivores[i].xCoord) === 0 && ((p.zCoord - this.herbivores[i].zCoord) >=-5 && (p.zCoord - this.herbivores[i].zCoord)<0))) {
          moveDirection = 3;
        } else
        if(this.plants.some(p => (p.xCoord - this.herbivores[i].xCoord) <=5 && (p.xCoord - this.herbivores[i].xCoord)>0 && ((p.zCoord - this.herbivores[i].zCoord) <=5 && (p.zCoord - this.herbivores[i].zCoord)>=-5))) {
          moveDirection = 0;
        } else
        if(this.plants.some(p => (p.xCoord - this.herbivores[i].xCoord) >=-5 && (p.xCoord - this.herbivores[i].xCoord)<0&& ((p.zCoord - this.herbivores[i].zCoord) <=5 && (p.zCoord - this.herbivores[i].zCoord)>=-5))) {
          moveDirection = 1;
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
          this.herbivore.createHerbivore(this.#scene);
          this.herbivores.push(this.herbivore);
        }
      console.log(this.herbivores[i].id +" hunger: " + this.herbivores[i].hunger)
      console.log(this.herbivores[i].id +" reproduction: " + this.herbivores[i].reproduction)
      }
    }, 3000);
  



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
