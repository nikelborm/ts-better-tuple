import { capitalize } from 'tsafe';

type Enumerate<
  SourceTuple extends unknown[],
  ResultEntriesTuple extends [number, unknown][] = []
> =
  ResultEntriesTuple['length'] extends SourceTuple['length']
    ? ResultEntriesTuple
    : Enumerate<SourceTuple, [
      ...ResultEntriesTuple,
      [ResultEntriesTuple['length'], SourceTuple[ResultEntriesTuple['length']]]
    ]>;

type BundleBack<
  UnionOfEntries extends [number, unknown],
  ResultTuple extends unknown[] = []
> =
  [UnionOfEntries] extends [never]
    ? ResultTuple
    : BundleBack<
      Exclude<UnionOfEntries, [ResultTuple['length'], unknown]>,
      [
        ...ResultTuple,
        Extract<UnionOfEntries, [ResultTuple['length'], unknown]>[1]
      ]
    >;

export type Prettify<T> = { [P in keyof T]: T[P] } & {};

// TODO: respond to https://github.com/Microsoft/TypeScript/issues/26223#issuecomment-410847836 when I finish this

// TODO: implement "pop" | "push" | "concat" | "join" | "reverse" | "shift"
// | "slice" | "sort" | "splice" | "unshift" | "indexOf" | "lastIndexOf" |
// "every" | "some" | "forEach" | "filter" | "reduce" | "reduceRight" |
// "find" | "findIndex" | "fill" | "copyWithin" | "entries" | "keys" |
// "values" | "includes" | "flatMap" | "flat" | "at" | "findLast" |
// "findLastIndex" | "toReversed" | "toSorted" | "toSpliced" | "with"


// The list above inspired by type of asds
// `declare const asds: Prettify<Exclude<keyof [], 'map'>>;`


class BetterTuple<
  const Tuple extends unknown[],
  // Enumeration extends Enumerate<Tuple> = Enumerate<Tuple>
> {
  constructor(private readonly source: Tuple) {}

  map<U extends [number, unknown]>(
    callbackfn: (
      valueWithIndex: Enumerate<Tuple> extends infer T extends unknown[]
        ? T[number]
        : never,
      array: Tuple
    ) => U
  ) {
    const returns = []
    for (let index = 0; index < this.source.length; index++) {
      returns.push(
        callbackfn(
          [index, this.source[index]] as any,
          this.source
        )
      );
    }
    return new BetterTuple(returns as BundleBack<U>);
  }

  unwrap() {
    return this.source
  }

  get length() {
    return this.source.length as Tuple['length']
  }
}

const fruits = [
  {
    name: "apple",
    color: "red"
  },
  {
    name: "pear",
    color: "yellow"
  },
  {
    name: "weirvyujkwervjn",
    colorFF: "q8974234by73wo8uhie"
  },
  {
    name: "watermelon",
    color: "green"
  },
  {
    nameDDDD: "3298vbyw4v3eouh",
    color: "asibdu8q3ovihaueuwi"
  },
] as const satisfies unknown[]

const tuple = new BetterTuple(fruits);


const asd = tuple
  .map(<T extends [number, unknown], U>([index, value]: T, arr: U) => [
    index,
    typeof value === 'object'
      && value !== null
      && 'name' in value
      && typeof value['name'] === 'string'
      && 'color' in value
      && typeof value['color'] === 'string'
    ? `${capitalize(value['name'])} has ${value['color']} color`
    : `broken object at index ${index}`
  ] as (
    // hint to distribute the type is needed here, so this `extends` has 2
    // roles at the same time. It runs the check AND distributes the type
    T extends [number, { name: string, color: string }]
      ? [T[0], `${Capitalize<T[1]['name']>} has ${T[1]['color']} color`]
      : [T[0], `broken object at index ${T[0]}`]
  ))
  .unwrap();
