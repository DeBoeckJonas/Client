import { Component, EventEmitter, Output } from '@angular/core';
import { SimulationService } from '../../services/simulation';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-settings-form',
  //routermodule idem aan navbar, nodig om bij submit naar simulation page te navigeren
  imports: [RouterModule],
  templateUrl: './settings-form.html',
  styleUrl: './settings-form.css'
})
export class SettingsForm {
  constructor(private simulationService : SimulationService){
    
  }
  startForm = false;
  showStartForm(){
    this.startForm = true;
  }
  //eventueel herschrijven naar @output
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
