import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moveTime'
})
export class MoveTimePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
