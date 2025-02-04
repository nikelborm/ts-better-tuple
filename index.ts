import { capitalize } from 'tsafe';

type Enumerate<
  SourceTuple extends unknown[],
  ResultEntriesTuple extends [unknown, number][] = [],
> = ResultEntriesTuple['length'] extends SourceTuple['length']
  ? ResultEntriesTuple
  : Enumerate<
      SourceTuple,
      [
        ...ResultEntriesTuple,
        [
          SourceTuple[ResultEntriesTuple['length']],
          ResultEntriesTuple['length'],
        ],
      ]
    >;

type BundleBack<
  UnionOfEntries extends [unknown, number],
  ResultTuple extends unknown[] = [],
> = [UnionOfEntries] extends [never]
  ? ResultTuple
  : BundleBack<
      Exclude<UnionOfEntries, [unknown, ResultTuple['length']]>,
      [
        ...ResultTuple,
        Extract<UnionOfEntries, [unknown, ResultTuple['length']]>[0],
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

  map<U extends [unknown, number]>(
    callbackfn: (
      valueWithIndex: Tuple extends any
        ? Enumerate<Tuple> extends infer T extends unknown[]
          ? T[number]
          : never
        : never,
      array: Tuple,
    ) => U,
  ) {
    const returns = [];
    for (let index = 0; index < this.source.length; index++) {
      returns.push(callbackfn([this.source[index], index] as any, this.source));
    }
    return new BetterTuple(returns as BundleBack<U>);
  }

  unwrap() {
    return this.source;
  }

  get length() {
    return this.source.length as Tuple['length'];
  }
}

const fruits = [
  {
    name: 'apple',
    color: 'red',
  },
  {
    name: 'pear',
    color: 'yellow',
  },
  {
    name: 'weirvyujkwervjn',
    colorFF: 'q8974234by73wo8uhie',
  },
  {
    name: 'watermelon',
    color: 'green',
  },
  {
    nameDDDD: '3298vbyw4v3eouh',
    color: 'asibdu8q3ovihaueuwi',
  },
] as const satisfies unknown[];

const tuple = new BetterTuple(fruits);

const asd = tuple
  .map(
    <T extends [unknown, number], U>([value, index]: T, arr: U) =>
      [
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof value['name'] === 'string' &&
        'color' in value &&
        typeof value['color'] === 'string'
          ? `${capitalize(value['name'])} has ${value['color']} color`
          : `broken object at index ${index}`,
        index,
        // hint to distribute the type is needed here, so this `extends` has 2
        // roles at the same time. It runs the check AND distributes the type
      ] as T extends [{ name: string; color: string }, number]
        ? [`${Capitalize<T[0]['name']>} has ${T[0]['color']} color`, T[1]]
        : [`broken object at index ${T[1]}`, T[1]],
  )
  .unwrap();
// Correctly inferred type (and value) should be
// const asd: [
//   "Apple has red color",
//   "Pear has yellow color",
//   "broken object at index 2",
//   "Watermelon has green color",
//   "broken object at index 4"
// ]
