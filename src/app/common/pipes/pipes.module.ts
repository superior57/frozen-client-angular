import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { NumberToSizePipe } from './number-to-size.pipe';
import { ArrayChangesDetectorPipe } from './array-changes-detector.pipe';

@NgModule({
  declarations: [SearchPipe, NumberToSizePipe, ArrayChangesDetectorPipe],
  imports: [CommonModule],
  exports: [SearchPipe, NumberToSizePipe, ArrayChangesDetectorPipe],
})
export class PipesModule {}
