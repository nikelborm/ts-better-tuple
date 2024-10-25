# ts-better-tuple

Typesafe iteration over tuples and more

Helpers:
1. [ksxnodemodules/typescript-tuple](https://github.com/ksxnodemodules/typescript-tuple)
2. [totalolage/typescript-tuple](https://github.com/totalolage/typescript-tuple)


Problem to be solved:

1. Mapping (`[...].map((e, i, a) => ...)`) tuples breaks types and doesn't allow for cool type inference
2. fucked up `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.fromEntries()`, `Array.prototype.map()`, `Array.prototype.reduce()`, `Array.prototype.filter()` which lose a tonn of type information partly for example because `.map` accepting split parameters breaks the relation between them. Also index is `number` which we know can be `0|1|2|3|4...`.
