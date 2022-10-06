import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: any[], ...args: any[]): any[] {
    const params = args[0];

    return value?.filter((v) => {
      for (const key of Object.keys(params)) {
        if (!(v[key] as string).toLowerCase().includes(params[key])) {
          return false;
        }
      }
      return true;
    });
  }
}
