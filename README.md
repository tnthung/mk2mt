# MK2MT

MK2MT stands for "Map Key to Multiple Types". It's a simple wrapper around `Map<string, any>`. It
allows you to map different keys to different types. With `Map` type, you cannot achieve the
requirement of mapping some keys to type `A` and other keys to type `B`. This class helps you to
achieve this. It's a simple wrapper around `Map<string, any>`. IMO, this package is only useful with
typescript, but feel free to use it with javascript.

MK2MT has the signature of `MK2MT<T extends [string|string[], any]>`, as you can see, the first
element of the tuple is the key, and the second element is the value. The key can be either a string
or a string array. The value can be any type. If the key a string array, the order doesn't matter,
under the hood, it will first be sorted then concatenated with `#~#` as the separator. For example,
`["a", "b"]` and `["b", "a"]` will be treated as the same key `"a#~#b"`. If the array key contains
only one element, it's exactly the same as the string key.

# Example

```typescript
import { MK2MT } from 'MK2MT';

const tmp = new MK2MT<
  | ["a" | "b"     , number ]   // map "a" and "b" to number
  | ["c"           , string ]   // map "c" to string
  | [["a", "b"]    , boolean]   // map ("a", "b") to boolean  (order doesn't matter)
  | [["a", "d"|"e"], number ]   // map ("a", "d") and ("a", "e") to number
>();

tmp.set("a", 1);                // OK
tmp.set("b", 2);                // OK
tmp.set("c", "3");              // OK
tmp.set("d", 4);                // Error, "d" is not in the key set
tmp.set(["a", "b"], true);      // OK
tmp.set(["a", "c"], false);     // Error, ["a", "c"] is not in the key set
```
