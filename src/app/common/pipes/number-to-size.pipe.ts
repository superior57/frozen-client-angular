import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToSize',
})
export class NumberToSizePipe implements PipeTransform {
  transform(value: number, ...args: number[]): unknown {
    let result = '';
    let formatToCurrency = false;

    if (args.length > 0) {
      formatToCurrency = args[0] === 1;
    }

    if (value > 1000) {
      result = `${(value % 1000).toFixed(2)}K`;
    } else {
      result = formatToCurrency ? `${value.toFixed(2)}` : `${value}`;
    }

    if (formatToCurrency) {
      result += ' $US';
    }

    return result;
  }
}
