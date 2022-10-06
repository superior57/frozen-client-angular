import { IterableDiffer, IterableDiffers, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayChangesDetector'
})
export class ArrayChangesDetectorPipe implements PipeTransform {
  private differ: IterableDiffer<any>;

  constructor(iDiff: IterableDiffers) {
    this.differ = iDiff.find([]).create();
  }

  transform(value: any[]): any[] {
    if (this.differ.diff(value)) {
      return [...value];
    }
    return value;
  }
}
