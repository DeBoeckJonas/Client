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
import { EntityDetail } from "../../components/entity-detail/entity-detail";
import { AnimalModel } from '../../models/animal.model';
import { Stats } from '../../services/stats';
import { BackendCommunication } from '../../services/backend-communication';


@Component({
  selector: 'app-simulation',
  imports: [FormsModule, SimulationView, StatsPanel, EntityDetail],
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
  selectedType: 'herbivore' | 'carnivore' | null = null;
  selectedAnimal!: AnimalModel;  
  continueTimeout:any;
  
  //nodig voor markForCheck, alsook simulation service meegeven
  constructor(private backendCommunication: BackendCommunication, private simulationService: SimulationService, private stats:Stats, private cdr: ChangeDetectorRef) {}

  get simulationServiceForHTML(){
    return this.simulationService;
  }
  get herbivoreList(){
    return this.simulationService.herbivores;
  }
  
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
      if(this.simulationService.isStarted){
      this.stats.calculateStats();
      }
    })

    if(this.simulationService.isStarted){
      this.backendCommunication.stopUpdate();
      this.start();
    }
    setInterval(() => {
    if(this.simulationService.continueValue){
      console.log("nnn")
      this.continue()
    }}, 100)
  }

  //rendered de scene en grid
  animate = () => {
    requestAnimationFrame(this.animate);
    this.#renderer.render(this.#scene, this.#camera);
  }
  
  start() {
    console.log("started")
    //intervals leegmaken, was oplossing voor raar gedrag bij verlaten en terug navigeren naar simulation route
    clearInterval(this.simulationService.carnInterval)
    clearInterval(this.simulationService.herbInterval)
    clearInterval(this.simulationService.plantInterval)

    clearInterval(this.stats.turnsSurvivedInterval)

    //reset scene
    this.simulationService.plants = [];
    this.simulationService.herbivores = [];
    this.simulationService.carnivores = [];
    this.backendCommunication.startUpdate();
    
    for(let i=0; i<this.#scene.children.length;i++){
      this.#scene.remove(this.#scene.children[i])
    }
    this.#scene.add(this.#grid.mesh);
    this.#scene.add(this.#grid.grid);
    this.simulationService.setStartValues()
    //entities aanmaken
    this.simulationService.createEntityStart(this.simulationService.startAmountHerb, Herbivore, this.simulationService.herbivores, this.#scene);
    this.simulationService.createEntityStart(this.simulationService.startAmountPlants, Plant, this.simulationService.plants, this.#scene);
    this.simulationService.createEntityStart(this.simulationService.startAmountCarnivores, Carnivore, this.simulationService.carnivores, this.#scene);
    
    //entities op grid plaatsen
    this.simulationService.intervalCreation(this.#scene)
    this.stats.setTurnsToTicks();
    this.stats.startTurnsCounter();
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

  //haalt scene leeg en voegt entities opgehaald uit db toe
  continue(){
    this.#scene.clear()
    this.#scene.add(this.#grid.mesh);
    this.#scene.add(this.#grid.grid);
    //timeout loopt soms nog door moeilijke timing en veroorzaakt bugs, eerst leegmaken als deze nog loopt
    if(this.continueTimeout) clearTimeout(this.continueTimeout)
    //timeout voor recreatie zodat oude instances zeker niet nog bestaan
    this.continueTimeout = setTimeout(()=>{
      this.simulationService.plants.forEach(p => p.createEntity(this.#scene));
      this.simulationService.herbivores.forEach(h => h.createEntity(this.#scene));
      this.simulationService.carnivores.forEach(c => c.createEntity(this.#scene));
    }, 2000)
    this.simulationService.continueValue = false;
  }
}
