import { get_input, InputMode } from "../utils/helpers.ts";

abstract class SnailfishNumber {
    parent?: PairNumber;
    abstract magnitude(): number;
    abstract regularsSorted(): RegularNumber[];
    abstract pairsWithDepthSorted(depth?: number): PairDepth[];
    abstract split(): boolean;
    abstract toString(): string;

    setParent(parent: PairNumber) {
        this.parent = parent;
    }

    root(): SnailfishNumber {
        return !this.parent ? this : this.parent.root();
    }

    static new(line: string): PairNumber {
        const stack: SnailfishNumber[] = [];
        const zeroCode = 48;
        const nineCode = 57;
        line.split("").forEach((ch) => {
            const code = ch.charCodeAt(0);
            const isNumber = code >= zeroCode && code <= nineCode;
            if (isNumber) {
                stack.push(new RegularNumber(Number(ch)));
            } else if (ch == "]") {
                const right = stack.pop()!;
                const left = stack.pop()!;
                stack.push(new PairNumber(left, right));
            }
        });

        return stack.shift() as PairNumber;
    }
}

class PairDepth {
    constructor(public depth: number, public pair: PairNumber) {}
}

class RegularNumber extends SnailfishNumber {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }

    addRegular(other: RegularNumber) {
        this.value += other.value;
    }

    splitToPair(parent: PairNumber): PairNumber {
        const toInt = (n: number) => Math.round(n);
        const floor = (n: number) => Math.floor(n);
        const ceil = (n: number) => Math.ceil(n);

        const pair = new PairNumber(
            new RegularNumber(toInt(floor(this.value / 2.0))),
            new RegularNumber(toInt(ceil(this.value / 2.0)))
        );

        pair.setParent(parent);
        return pair;
    }

    magnitude() {
        return this.value;
    }

    split() {
        return false;
    }

    regularsSorted(): RegularNumber[] {
        return [this];
    }

    pairsWithDepthSorted(): PairDepth[] {
        return [];
    }

    toString() {
        return this.value.toString();
    }
}

class PairNumber extends SnailfishNumber {
    left: SnailfishNumber;
    right: SnailfishNumber;

    constructor(left: SnailfishNumber, right: SnailfishNumber) {
        super();
        this.left = left;
        this.right = right;
        this.left.setParent(this);
        this.right.setParent(this);
    }

    plus(other: SnailfishNumber): PairNumber {
        const pair = new PairNumber(this, other);
        pair.reduce();
        return pair;
    }

    magnitude() {
        return this.left.magnitude() * 3 + this.right.magnitude() * 2;
    }

    isRegular = (n: SnailfishNumber) => n instanceof RegularNumber;

    replace(child: SnailfishNumber, replacement: SnailfishNumber) {
        replacement.setParent(this);

        if (this.left === child) {
            this.left = replacement;
        } else {
            this.right = replacement;
        }
    }

    regularsSorted(): RegularNumber[] {
        return [...this.left.regularsSorted(), ...this.right.regularsSorted()];
    }

    pairsWithDepthSorted(depth: number = 0): PairDepth[] {
        depth ??= 0;
        return [
            ...this.left.pairsWithDepthSorted(depth + 1),
            new PairDepth(depth, this),
            ...this.right.pairsWithDepthSorted(depth + 1),
        ];
    }

    explode(): boolean {
        const pairs = this.root().pairsWithDepthSorted();
        const exploding = pairs.find((p) => p.depth === 4);

        if (!exploding) return false;

        const pair = exploding.pair;
        const regulars = this.root().regularsSorted();

        if (this.isRegular(pair.left)) {
            const left = pair.left as RegularNumber;
            const i = regulars.indexOf(left);

            if (i !== -1 && i - 1 >= 0) {
                regulars[i - 1].addRegular(left);
            }
        }

        if (this.isRegular(pair.right)) {
            const right = pair.right as RegularNumber;
            const j = regulars.indexOf(right as RegularNumber);

            if (j !== -1 && j + 1 < regulars.length) {
                regulars[j + 1].addRegular(right as RegularNumber);
            }
        }

        pair.parent?.replace(pair, new RegularNumber(0));
        return true;
    }

    split() {
        if (this.isRegular(this.left)) {
            const left = this.left as RegularNumber;
            if (left.value >= 10) {
                this.left = left.splitToPair(this);
                return true;
            }
        }

        const leftSplit = this.left.split();
        if (leftSplit) return true;

        if (this.isRegular(this.right)) {
            const right = this.right as RegularNumber;

            if (right.value >= 10) {
                this.right = right.splitToPair(this);
                return true;
            }
        }

        return this.right.split();
    }

    reduce() {
        let should_reduce = this.explode() || this.split();
        do {
            should_reduce = this.explode() || this.split();
        } while (should_reduce);
    }

    maxDepth() {
        return Math.max(
            ...this.root()
                .pairsWithDepthSorted()
                .map((pd) => pd.depth)
        );
    }

    maxValue() {
        return Math.max(
            ...this.root()
                .regularsSorted()
                .map((r) => r.value)
        );
    }

    toString() {
        return `[${this.left.toString()},${this.right.toString()}]`;
    }
}

function part1(input: string[]) {
    const pairs = input.map((line) => PairNumber.new(line));
    const total = pairs.reduce((prev, current) => prev.plus(current));
    console.log(`final pair: ${total.toString()}`);
    console.log(`magnitude: ${total.magnitude()}`);
}

function part2(input: string[]) {
    const magnitudes: number[] = [];

    input.forEach((line, i) => {
        input
            .filter((_, j) => i !== j)
            .forEach((other_line) => {
                const a = PairNumber.new(line);
                const b = PairNumber.new(other_line);
                const total = a.plus(b);
                magnitudes.push(total.magnitude());
            });
    });

    console.log(`maximum magnitude: ${Math.max(...magnitudes)}`);
}
const input = get_input(InputMode.Real);
part1(input);
part2(input);
