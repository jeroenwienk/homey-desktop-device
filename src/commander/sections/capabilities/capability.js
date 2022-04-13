import { makeBooleanCapabilitySection } from './boolean';
import { makeNumberCapabilitySection } from './number';
import { makeEnumCapabilitySection } from './enum';
import { makeStringCapabilitySection } from './string';

export function makeCapabilitySections({ value }) {
  let next = null;

  switch (value.context.capability.type) {
    case 'boolean':
      next = makeBooleanCapabilitySection({ value });
      break;
    case 'number':
      next = makeNumberCapabilitySection({ value });
      break;
    case 'enum':
      next = makeEnumCapabilitySection({ value });
      break;
    case 'string':
      next = makeStringCapabilitySection({ value });
      break;
    default:
      next = [];
      break;
  }

  return {
    sections: next,
  };
}
