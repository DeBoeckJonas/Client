import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { BackendCommunication } from '../../services/backend-communication';
import { SimulationService } from '../../services/simulation';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(private backendCommunication: BackendCommunication, private simulation: SimulationService){}
  retrieveData(){
    this.backendCommunication.retrieveData();
    this.simulation.continue();
  }
}
