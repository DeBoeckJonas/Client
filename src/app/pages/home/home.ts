import { Component, ViewChild } from '@angular/core';
import { Simulation } from '../simulation/simulation';
import { SimulationService } from '../../services/simulation';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsForm } from "../../components/settings-form/settings-form";

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule, SettingsForm],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @ViewChild(SettingsForm) settingsForm!:SettingsForm;

  triggerSettingsForm() {
    this.settingsForm.showStartForm();
  }
  
}
