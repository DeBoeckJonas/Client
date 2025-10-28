import { Component } from '@angular/core';
import { Stats } from '../../services/stats';


@Component({
  selector: 'app-highscores',
  imports: [],
  templateUrl: './highscores.html',
  styleUrl: './highscores.css'
})
export class Highscores {
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
  showHighscores(){
    this.highscores=true;
  }
  close(){
    this.highscores=false;
  }
}
