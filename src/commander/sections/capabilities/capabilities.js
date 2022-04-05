import { makeBooleanCapabilitySection } from './boolean';
import { makeNumberCapabilitySection } from './number';
import { makeEnumCapabilitySection } from './enum';

export function makeCapabilitySection({ value }) {
  switch (value.capability.type) {
    case 'boolean':
      return makeBooleanCapabilitySection({ value });
    case 'number':
      return makeNumberCapabilitySection({ value });
    case 'enum':
      return makeEnumCapabilitySection({ value });
    default:
      return [];
  }
}
