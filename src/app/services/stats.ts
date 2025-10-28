import { Injectable } from '@angular/core';
import { SimulationService } from './simulation';


@Injectable({
  providedIn: 'root'
})
export class Stats {
  turnsSurvived = 0;
  turnsToTicks = 0;
  maxHerbivoresAtOnce = 0;
  maxCarnivoresAtOnce =  0;
  totalHerbivores = 0;
  totalCarnivores = 0;
  turnsSurvivedInterval!: ReturnType<typeof setInterval>;
  constructor(private simulationService: SimulationService){
  }
  
  setTurnsToTicks(){
    if(this.simulationService.intervalTimeHerbivore>= this.simulationService.intervalTimeCarnivore){
      this.turnsToTicks = this.simulationService.intervalTimeHerbivore
    } else {
      this.turnsToTicks = this.simulationService.intervalTimeCarnivore
    }
  }

  startTurnsCounter(){
    if(this.simulationService.isStarted && !this.turnsSurvivedInterval){
      this.turnsSurvivedInterval = setInterval(():void =>{
        this.turnsSurvived++;
        console.log(this.turnsSurvived);
      }, this.turnsToTicks)
    }
  }


  calculateStats(){
    if(this.simulationService.herbivores.length>this.maxHerbivoresAtOnce){
      this.maxHerbivoresAtOnce = this.simulationService.herbivores.length;
    }
    if(this.simulationService.carnivores.length>this.maxCarnivoresAtOnce){
      this.maxCarnivoresAtOnce = this.simulationService.carnivores.length;
    }
    if(this.simulationService.carnivores.length === 0){
      this.simulationService.isStarted = false;
      if(this.totalCarnivores<this.simulationService.totalCarn){
        this.totalCarnivores = this.simulationService.totalCarn;
      }
      if(this.totalHerbivores<this.simulationService.totalHerb){
        this.totalHerbivores = this.simulationService.totalHerb;
      }
      clearInterval(this.turnsSurvivedInterval);
      console.log(this.maxCarnivoresAtOnce + " carn " + this.maxHerbivoresAtOnce + " herb " + this.turnsSurvived + " survived " + this.totalCarnivores + " max carn " + this.totalHerbivores + " max herb");
    }
  }
}
