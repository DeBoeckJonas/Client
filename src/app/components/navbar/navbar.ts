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
  clicked=false;
  //retrieveData hier gezet zodat deze opgehaald wordt bij het navigeren naar /simulation
  constructor(private backendCommunication: BackendCommunication, private simulation: SimulationService){}
  async retrieveData(){
    if(!this.clicked){
      console.log("loading")
      this.simulation.isUpdating = true;
      this.clicked = true;
      await this.backendCommunication.retrieveData();
      await this.simulation.continue();
      setTimeout(()=>{this.clicked = false; this.simulation.isUpdating = false; }, 2000)
    }
  }
}
