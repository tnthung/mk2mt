

type HasIntersect<T extends any[], S extends any[]> =
  T[number] extends infer T
    ? S[number] extends infer S
      ? T extends S ? true :
        S extends T ? true : false
      : never
    : never;


type FilterTuple<T extends any[], S extends any[]> =
  T extends [infer F, ...infer R]
    ? HasIntersect<[F], S> extends false
      ? [F, ...FilterTuple<R, S>]
      : FilterTuple<R, S>
    : T;


type Unionify<T extends string[]> =
  T extends [infer F extends string, ...infer R extends string[]]
    ? [F] | Unionify<R> : never;


type  Compare<S extends [string], T extends [string]> = _Compare<S, S, T, T>;
type _Compare<S extends [string], S2 extends [string], T extends [string], T2 extends [string]> =
  T extends infer V extends [string]
    ? V[number] extends S[number]
      ? S extends infer U extends [string]
        ? V[number] extends U[number]
          ? true | Compare<Exclude<S2, U>, Exclude<T2, V>>
          : never
        : false
      : false
    : false;


export class MK2MT<P extends [string[], any]> {
  #val: P extends [[], infer V] ? V : never = undefined as any;

  #k2v = new Map<P[0][number], Set<P[1]>>();
  #v2h = new Map<P[1], Set<string>>();


  #hash(...tags: P[0]) {
    tags = tags.sort();
    return tags.join("\x00");
  }

  #inter<K extends P[0][number]>(...tags: K[]) {
    let result = this.values;

    for (const tag of tags) {
      const values = this.#k2v.get(tag);
      if (values == null) return [];

      result = result.filter(v => values.has(v));
      if (!result.length) return [];
    }

    return result;
  }


  public get tags() {
    return [...this.#k2v.keys()];
  }

  public get values() {
    return [
      ...(this.#v2h.keys()),
      ...(this.#val ? [this.#val] : [])
    ];
  }

  public set<V extends P[1]>(value: V, ...tags: P extends [infer K, infer T] ? V extends T ? K : never : never) {
    if (!tags.length) {
      this.#val = value;
      return;
    }

    tags.forEach(tag => {
      let values = this.#k2v.get(tag);
      if (values == null) this.#k2v.set(
        tag, values = new Set());
      values.add(value);
    });

    const hash = this.#hash(...tags);

    let values = this.#v2h.get(value);
    if (values == null) this.#v2h.set(
      value, values = new Set());
    values.add(hash);
  }

  public get<K extends P[0]>(...tags: K):
    P extends [infer T, infer V]
      ? T extends string[]
        ? K extends T
          ? V | undefined
          : never
        : never
      : never
  {
    if (!tags.length)
      return this.#val as any;

    const hash = this.#hash(...tags);

    return this.#inter(...tags).find(v =>
      this.#v2h.get(v)?.has(hash)) as any;
  }

  public fuzzyGet<Ks extends P[0][number][]>(...tags: Ks):
    MK2MT<Compare<Unionify<P[0]>, Unionify<Ks>> extends true
      ? P extends [infer T extends string[], infer V]
        ? Ks[number] extends T[number]
          ? [FilterTuple<T, Ks>, V]
          : never
        : never
      : never>
  {
    const mk2mt = new MK2MT<any>();

    if (!tags.length)
      mk2mt.set(this.#val);

    for (const value of this.#inter(...tags)) {
      for (const hash of [...this.#v2h.get(value) ?? []]) {
        const t = hash.split("\x00");
        if (t == null) continue;

        if (!tags.every(tag =>
              t!.includes(tag)))
          continue;

        mk2mt.set(value, ...t.filter(
          tag => !tags.includes(tag)));
      }
    }

    return mk2mt;
  }
}
