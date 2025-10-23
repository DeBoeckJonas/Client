//wat geprobeerd, collision van herbivoren lijkt mij veel, omslachtig werk, voorlopig kunnen ze in hetzelfde vakje komen (ik zie niet meteen een andere manier dan eerst het
//vakje waar ze naartoe gaan op te slaan in een array, deze te vergelijken en als er gelijke waarden zijn, nieuwe berekeningen te maken) dit als eventuele extra toevoeging later

//momenteel kunnen prooien nog ontsnappen als ze op andere gametick snelheid zitten, ze worden tick erna dan gevangen, dus geen probleem, maar eventueel latere update

import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { Grid } from '../../models/grid.model';
import { SimulationView } from "../../components/simulation-view/simulation-view";
import { StatsPanel } from "../../components/stats-panel/stats-panel";
import { Plant } from '../../models/plant.model';
import { Herbivore } from '../../models/herbivore.model';
import { Carnivore } from '../../models/carnivore.model';
import { SimulationService } from '../../services/simulation';

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
  
  

  //nodig voor markForCheck, alsook simulation service meegeven
  constructor(private simulationService: SimulationService, private cdr: ChangeDetectorRef) {}
  
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

    //door push op arrays in service wordt geen nieuwe array-referentie aangemaakt en wordt deze overgeslagen bij checks, 
    //via markforcheck wordt deze toch ook telkens gechecked door angular bij detection change cycle en update de @input automatisch
    setInterval(():void => {
      this.cdr.markForCheck();
    })

    //entities aanmaken
    this.simulationService.createEntityStart(this.simulationService.startAmountHerb, Herbivore, this.simulationService.herbivores, this.#scene);
    this.simulationService.createEntityStart(this.simulationService.startAmountPlants, Plant, this.simulationService.plants, this.#scene);
    this.simulationService.createEntityStart(this.simulationService.startAmountCarnivores, Carnivore, this.simulationService.carnivores, this.#scene);
    
    //entities op grid plaatsen
    this.simulationService.intervalCreation(this.#scene)
  }

  //rendered de scene en grid
  animate = () => {
    requestAnimationFrame(this.animate);
    this.#renderer.render(this.#scene, this.#camera);
  }
  
  //geeft elementen mee aan DOM element zodat componenten deze kunnen gebruiken
  get fieldCamera(): THREE.PerspectiveCamera {
    return this.#camera;
  }

  get plantAmount(): number {
    return this.simulationService.plants.length;
  }

  get herbivoreAmount(): number {
    return this.simulationService.herbivores.length;
  }

  get carnivoreAmount(): number {
    return this.simulationService.carnivores.length;
  }
}
