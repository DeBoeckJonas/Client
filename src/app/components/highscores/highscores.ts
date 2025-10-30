import { Component, Input } from '@angular/core';
import { Stats } from '../../services/stats';


@Component({
  selector: 'app-highscores',
  imports: [],
  templateUrl: './highscores.html',
  styleUrl: './highscores.css'
})
export class Highscores {
  //input voor waarden voor highscores op te halen
  @Input() turnsSurvived = 0;
  @Input() maxHerbivoresAtOnce = 0;
  @Input() maxCarnivoresAtOnce = 0;
  @Input() totalHerbivores = 0;
  @Input() totalCarnivores = 0;

  highscores = false;

  //om highscores te tonen en weer weg te halen wordt variabele gebruikt die html toont of weghaalt
  showHighscores(){
    this.highscores=true;
  }
  close(){
    this.highscores=false;
  }
}
