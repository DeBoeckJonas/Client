import { Component } from '@angular/core';
import { Simulation } from '../simulation/simulation';
import { SimulationService } from '../../services/simulation';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  constructor(private simulationService : SimulationService){
    
  }
  startForm = false;
  showStartForm(){
    this.startForm = true;
    console.log(this.startForm)
  }
  start(plantAmount:string, herbAmount:string, carnAmount:string, herbSearchRange:string, carnSearchRange:string, herbTicks:string, carnTicks:string, plantTicks:string):void{
    this.simulationService.herbSearchRangeInput = parseInt(herbSearchRange);
    this.simulationService.carnSearchRangeInput = parseInt(carnSearchRange);
    this.simulationService.startAmountPlantInput = parseInt(plantAmount);
    this.simulationService.startAmountHerbInput = parseInt(herbAmount);
    this.simulationService.startAmountCarnInput = parseInt(carnAmount);
    this.simulationService.carnTickInput = parseInt(carnTicks);
    this.simulationService.herbTickInput = parseInt(herbTicks);
    this.simulationService.plantTickInput = parseInt(plantTicks);

    this.simulationService.isStarted = true;
    this.startForm = false;
  }
}
