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
  //viewchild zodat settingsform en highscore methods kunnen gebruikt worden
  @ViewChild(SettingsForm) settingsForm!:SettingsForm;
  @ViewChild(Highscores) highscores!:Highscores;
  //zet de showstartform op true (methode in settingsform)
  triggerSettingsForm() {
    this.settingsForm.showStartForm();
  }
  //doe de getstats method op highscores om stats op te halen
  //zet showhighscores op true (methode in showhighscores)
  triggerHighscores(){
    this.highscores.getStats();
    this.highscores.showHighscores();
    console.log('clicked')
  }
}
