import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SettingsForm } from "../../components/settings-form/settings-form";
import { Highscores } from '../../components/highscores/highscores';
import { Stats } from '../../services/stats';

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule, SettingsForm, Highscores],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  //viewchild zodat settingsform en highscore methods kunnen gebruikt worden
  @ViewChild(SettingsForm) settingsForm!:SettingsForm;
  @ViewChild(Highscores) highscores!:Highscores;
  constructor(private stats:Stats){}
  //zet de showstartform op true (methode in settingsform)
  triggerSettingsForm() {
    this.settingsForm.showStartForm();
  }
  //doe de getstats method op highscores om stats op te halen
  //zet showhighscores op true (methode in showhighscores)
  triggerHighscores(){
    this.highscores.showHighscores();
    console.log('clicked')
  }
  get turnsSurvived() { return this.stats.turnsSurvived; }
  get maxHerbivores() { return this.stats.maxHerbivoresAtOnce; }
  get maxCarnivores() { return this.stats.maxCarnivoresAtOnce; }
  get totalHerbivores() { return this.stats.totalHerbivores; }
  get totalCarnivores() { return this.stats.totalCarnivores; }
}
