import { Injectable } from '@angular/core';
import { SimulationService } from './simulation';
import { Plant } from '../models/plant.model';
import { Herbivore } from '../models/herbivore.model';
import { Carnivore } from '../models/carnivore.model';

@Injectable({
  providedIn: 'root'
})
export class BackendCommunication {
  constructor(private simulationService: SimulationService){}

  plantsArray:{id:number, xCoord:number, zCoord:number} [] = []
  carnivoresArray:{id:number, xCoord:number, zCoord:number, reproduction:number, hunger:number} [] = []
  herbivoresArray:{id:number, xCoord:number, zCoord:number, reproduction:number, hunger:number} [] = []
  updatePlant!: ReturnType<typeof setInterval>;
  updateCarnivore!: ReturnType<typeof setInterval>;
  updateHerbivore!: ReturnType<typeof setInterval>;

  startUpdate(){
    this.updatePlant = setInterval(async ():Promise<void> => {
      this.plantsArray = [];
      this.simulationService.plants.forEach(p => {
        const plant = {id:p.id, xCoord:p.xCoord, zCoord:p.zCoord}
        this.plantsArray.push(plant)
      });
      await fetch('http://localhost:3010/update-plants', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.plantsArray)
      })
    }, this.simulationService.intervalTimePlant);

    this.updateCarnivore = setInterval(async ():Promise<void> => {
      this.herbivoresArray = [];
      this.simulationService.carnivores.forEach(c => {
        const carnivore = {id:c.id, xCoord:c.xCoord, zCoord:c.zCoord, reproduction:c.reproduction, hunger:c.hunger}
        this.carnivoresArray.push(carnivore)
      });
      await fetch('http://localhost:3010/update-carnivores', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.carnivoresArray)
      })
    }, this.simulationService.intervalTimeCarnivore);

    this.updateHerbivore = setInterval(async ():Promise<void> => {
      this.carnivoresArray = [];
      this.simulationService.herbivores.forEach(c => {
        const herbivore = {id:c.id, xCoord:c.xCoord, zCoord:c.zCoord, reproduction:c.reproduction, hunger:c.hunger}
        this.herbivoresArray.push(herbivore)
      });
      await fetch('http://localhost:3010/update-herbivores', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.herbivoresArray)
      })
    }, this.simulationService.intervalTimeHerbivore);
  }
  stopUpdate(){
    clearInterval(this.updatePlant);
    clearInterval(this.updateCarnivore);
    clearInterval(this.updateHerbivore);
  }

  async retrieveData(){
    let responseP = await fetch('http://localhost:3010/plants');
    if(responseP.ok) {
      this.simulationService.plants = [];
      let oldPlantArray = await responseP.json();
      this.simulationService.plants = oldPlantArray.map((p:any)=> new Plant(p.xCoord, p.zCoord))
      console.log(this.simulationService.plants)
    }
    let responseH = await fetch('http://localhost:3010/herbivores');
    if(responseH.ok) {
      this.simulationService.herbivores = [];
      let oldHerbArray = await responseH.json();
      this.simulationService.herbivores = oldHerbArray.map((p:any)=> {const herbivore = new Herbivore(p.xCoord, p.zCoord)
        herbivore.hunger = p.hunger;
        herbivore.reproduction = p.reproduction;
        return herbivore
      })
      console.log(this.simulationService.herbivores)
    }
    let responseC = await fetch('http://localhost:3010/carnivores');
    if(responseC.ok) {
      this.simulationService.carnivores = [];
      let oldCarnArray = await responseC.json();
      this.simulationService.carnivores = oldCarnArray.map((p:any)=> {const carnivore = new Carnivore(p.xCoord, p.zCoord)
        carnivore.hunger = p.hunger;
        carnivore.reproduction = p.reproduction
        return carnivore
      })
      console.log(this.simulationService.carnivores)
    }
  }
}
