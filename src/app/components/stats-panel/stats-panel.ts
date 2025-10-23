import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-stats-panel',
  imports: [],
  templateUrl: './stats-panel.html',
  styleUrl: './stats-panel.css'
})
export class StatsPanel {
  @Input() plantAmount!: number;
  @Input() herbivoreAmount!: number;
  @Input() carnivoreAmount!: number;
}
