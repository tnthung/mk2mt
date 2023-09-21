

type V<T extends [string|string[], any], K extends T[0]> =
  T extends infer U
    ? U extends [infer KS, infer V]
      ? K extends KS
        ? V
        : never
      : never
    : never;


export class MK2MT<T extends [string|string[], any]> {
  #map = new Map<string, any>();

  public set<K extends T[0]>(k: K, v: V<T, K>) {
    this.#map.set(MK2MT.#key(k), v);
  }

  public get<K extends T[0]>(k: K): V<T, K> {
    return this.#map.get(MK2MT.#key(k)) as V<T, K>;
  }

  static #key(k: string|string[]): string {
    return Array.isArray(k) ? k.sort().join("#~#") : k;
  }
}
