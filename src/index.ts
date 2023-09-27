

export class MK2MT<P extends [string[], any]> {
  #k2v = new Map<P[0][number], Set<P[1]>>();
  #val = [] as P[1][];

  public get tags  () { return this.#k2v.keys(); }
  public get values() { return this.#val;        }

  public set<V extends P[1]>(
    value: V,
    ...tags: P extends [infer K, infer T]
      ? V extends T ? K : never : never
  ) {
    for (const tag of tags) {
      let values = this.#k2v.get(tag);
      if (values == null) this.#k2v.set(
        tag, values = new Set());
      values.add(value);
    }

    this.#val.push(value);
  }

  public get<K extends P[0][number]>(...tags: K[]):
    P extends [infer T, infer V]
      ? T extends string[]
        ? [K] extends [T[number]]
          ? V[] | undefined
          : never
        : never
      : never
  {
    const vals = tags.map(tag => this.#k2v.get(tag))
      .filter(v => v != null) as Set<P[1]>[];
    if (vals.length === 0) return undefined as any;

    const intersection = new Set(vals[0]);
    for (let i=1; i<vals.length; i++)
      for (const v of vals[i])
        if (!intersection.has(v))
          intersection.delete(v);

    if (intersection.size === 0)
      return undefined as any;
    return [...intersection] as any;
  }

  public getExact<K extends P[0]>(...tags: K):
    P extends [infer T, infer V]
      ? T extends string[]
        ? K extends T
          ? V | undefined
          : never
        : never
      : never
  {
    const vals = this.get(...tags);

    if (vals        ==  null) return undefined as any;
    if (vals.length !== 1   ) return undefined as any;

    return vals[0];
  }
}
