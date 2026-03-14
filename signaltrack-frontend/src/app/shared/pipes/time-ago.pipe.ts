import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const now = Date.now();
    const time = new Date(value).getTime();
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return 'acum câteva secunde';
    if (diff < 3600) return `acum ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `acum ${Math.floor(diff / 3600)} oră`;
    return `acum ${Math.floor(diff / 86400)} zile`;
  }
}
