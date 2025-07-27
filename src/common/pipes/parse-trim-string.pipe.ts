import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseTrimStringPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) return value;

    const trimStrings = (obj: any) => {
      for (const key in obj) {
        const val = obj[key];
        if (typeof val === 'string') {
          obj[key] = val.trim();
        } else if (typeof val === 'object' && val !== null) {
          trimStrings(val);
        }
      }
    };

    trimStrings(value);
    return value;
  }
}
