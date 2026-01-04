import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { BackendCommunication } from '../../services/backend-communication';
import { SimulationService } from '../../services/simulation';


@Component({
  selector: 'app-navbar',
  //routermodule nodig voor app.routes.ts te kunnen gebruiken
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  //clicked zodat dit enkel kan opgeroepen worden na refresh of page navigatie, houdt duplicatie van entities tegen
  clicked=false;
  //retrieveData hier gezet zodat deze opgehaald wordt bij het navigeren naar /simulation
  constructor(private backendCommunication: BackendCommunication, private simulation: SimulationService){}
  async retrieveData(){
    if(!this.clicked){
      await this.backendCommunication.retrieveData();
      await this.backendCommunication.retrieveStartvalues();
      await this.simulation.continue();
      this.clicked = true;
    }
  }
  stop(){
    this.clicked = false;
    this.simulation.startValuesTrigger = false;
    this.simulation.isStarted = false;
    this.simulation.continueValue = false;
  }
}
