import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statsToPercentPipe'
})
export class StatsToPercent implements PipeTransform {

  transform(value: number, max:number): number {
    let numberInPercent = 100/max*value;
    return numberInPercent;
  }
}
