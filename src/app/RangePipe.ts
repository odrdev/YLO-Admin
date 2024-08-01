import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'range',
  standalone: true,
})
export class RangePipe implements PipeTransform {
  transform(length: number, offset: number = 1): number[] {
    if (!length) {
      return [];
    }
    console.log('rage pipe')
    const array = [];
    for (let n = 0; n < length; ++n) {
      array.push(offset + n);
    }
    return array;
  }
}