import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { Grid } from '../../models/grid.model';
import { SimulationView } from "../../components/simulation-view/simulation-view";
import { StatsPanel } from "../../components/stats-panel/stats-panel";
import { Plant } from '../../models/plant.model';

@Component({
  selector: 'app-simulation',
  imports: [FormsModule, SimulationView, StatsPanel],
  templateUrl: './simulation.html',
  styleUrl: './simulation.css'
})
//afterviewinit voor width en height te kunnen uitlezen, geprobeerd met OnInit, maar dan kloppen de waarden niet
export class Simulation implements AfterViewInit{
  //viewchild voor reference naar DOM element in plaats van values uit te lezen, static : true zodat playfield beschikbaar is oninit, elementref is wrapper rond HTMLElement
  @ViewChild('playField', { static: true }) playFieldRef!: ElementRef;
  

  //variabelen
  #scene!:THREE.Scene;
  #renderer!: THREE.WebGLRenderer;
  #camera!: THREE.PerspectiveCamera;
  #grid!: Grid;
  plant!: Plant;
  plants = new Array;


  
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

    //plant op grid plaatsen
    setInterval(():void => {
    let x = Math.floor(Math.random()*30);
    let z = Math.floor(Math.random()*30);
    if(!this.plants.some(p => p.xCoord === x && p.zCoord === z)){
      this.plant = new Plant(x , z);
      this.plant.createPlant(this.#scene);
      this.plants.push(this.plant);
      console.log(this.plant.id)
    } else { console.log("taken")}
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


  



}
