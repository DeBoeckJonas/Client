import { Injectable } from '@angular/core';
import { SimulationService } from './simulation';
import { Plant } from '../models/plant.model';

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

}
