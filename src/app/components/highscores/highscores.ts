import { Component } from '@angular/core';
import { Stats } from '../../services/stats';


@Component({
  selector: 'app-highscores',
  imports: [],
  templateUrl: './highscores.html',
  styleUrl: './highscores.css'
})
export class Highscores {
  // constructor en getstats nog te veranderen naar @input
  constructor(private statsService: Stats){}
  turnsSurvived = 0;
  maxHerbivoresAtOnce = 0;
  maxCarnivoresAtOnce =  0;
  totalHerbivores = 0;
  totalCarnivores = 0;
  highscores = false;

  getStats(){
    this.turnsSurvived = this.statsService.turnsSurvived;
    this.maxCarnivoresAtOnce = this.statsService.maxCarnivoresAtOnce;
    this.maxHerbivoresAtOnce = this.statsService.maxHerbivoresAtOnce;
    this.totalCarnivores = this.statsService.totalCarnivores;
    this.totalHerbivores = this.statsService.totalHerbivores;
  }
  //om highscores te tonen en weer weg te halen wordt variabele gebruikt die html toont of weghaalt
  showHighscores(){
    this.highscores=true;
  }
  close(){
    this.highscores=false;
  }
}
