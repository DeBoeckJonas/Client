import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsForm } from "../../components/settings-form/settings-form";
import { Highscores } from '../../components/highscores/highscores';

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule, SettingsForm, Highscores],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  @ViewChild(SettingsForm) settingsForm!:SettingsForm;
  @ViewChild(Highscores) highscores!:Highscores;

  triggerSettingsForm() {
    this.settingsForm.showStartForm();
  }
  triggerHighscores(){
    this.highscores.getStats();
    this.highscores.showHighscores();
    console.log('clicked')
  }
}
