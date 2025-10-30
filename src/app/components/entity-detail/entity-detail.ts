import { Component, Input } from '@angular/core';
import { StatsToPercent } from "../../pipes/stats-to-percent";
import { DecimalPipe } from '@angular/common';
import { AnimalModel } from '../../models/animal.model';

@Component({
  selector: 'app-entity-detail',
  imports: [StatsToPercent, DecimalPipe],
  templateUrl: './entity-detail.html',
  styleUrl: './entity-detail.css'
})
export class EntityDetail {
  // input om data van de entities op te halen zodat de html deze kan tonen
  @Input() animal!: AnimalModel;
}
