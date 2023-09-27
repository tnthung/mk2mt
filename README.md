# MK2MT

MK2MT stands for "Map Key to Multiple Types". Unlike JS native `Map` class which can only map keys
to one type, MK2MT allows you to map specific keys to corresponding types. More, this type allows
you to get values that are sharing the same key with partially inputted keys.

# Example

```typescript
import { MK2MT } from 'MK2MT';

const tmp = new MK2MT<
  | [["a" | "b"   ], number ]   // map "a" and "b" to number
  | [["c"         ], string ]   // map "c" to string
  | [["a", "b"    ], boolean]   // map ("a", "b") to boolean  (order doesn't matter)
  | [["a", "d"|"e"], number ]   // map ("a", "d") and ("a", "e") to number
>();

tmp.set(1, "a");       // OK
tmp.set(2, "b");       // OK
tmp.set(3, "c");       // Error
tmp.set(4, "d");       // Error
tmp.set(5, "a", "d");  // OK

tmp.get("a");          // type is undefined | number[] | boolean[]
tmp.get("a", "d");     // type is undefined | number[]
tmp.get("a", "e");     // type is undefined | number[]
tmp.get("d");          // type is undefined | number[]
```
