import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'speedFormat', standalone: true })
export class SpeedFormatPipe implements PipeTransform {
  transform(value: number): string {
    // TODO: Format speed value
    return `${value} km/h`;
  }
}
