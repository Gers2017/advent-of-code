import {readFileSync} from "fs";
import {join} from "path";

const cwd = process.cwd();
type Segment = { x1: number; y1: number; x2: number; y2: number };

function travel(
    {from = 0, to, step = 1}: { from?: number; to: number; step?: number },
    callback?: (current: number) => void
) {
    for (let d = Math.min(from, to); d <= Math.max(from, to); d += step) {
        callback && callback(d);
    }
}

function range(from: number, to: number) {
    let arr = [];
    if (from <= to) {
        for (let i = from; i <= to; i++) {
            arr.push(i);
        }
    } else if (from > to) {
        for (let i = from; i >= to; i--) {
            arr.push(i);
        }
    }
    return arr;
}

function count(segments: Segment[], use_diagonal: boolean = false) {
    let counter: { [key: string]: number } = {};

    const add_counter = (x: number, y: number) => {
        let key = `${x},${y}`;
        counter[key] ? (counter[key] += 1) : (counter[key] = 1);
    };

    for (const {x1, y1, x2, y2} of segments) {
        if (y1 === y2 || x1 === x2) {
            if (y1 === y2) travel({from: x1, to: x2}, (xi) => add_counter(xi, y1));
            if (x1 === x2) travel({from: y1, to: y2}, (yi) => add_counter(x1, yi));
        } else if (use_diagonal) {
            let rangex = range(x1, x2);
            let rangey = range(y1, y2);
            for (let k = 0; k <= Math.abs(x1 - x2); k++) {
                add_counter(rangex[k], rangey[k]);
            }
        }
    }
    return Object.values(counter).filter((count) => count >= 2).length;
}

let _text = readFileSync(join(cwd, "test_input.txt"), {encoding: "utf-8"});

let input: Segment[] = _text.split("\n").map((line, i) => {
    let regex = /^(\d+),(\d+) -> (\d+),(\d+)$/gim;
    let match = regex.exec(line);
    if (!match) throw Error(`Invalid line '${line}' at index ${i}`);
    let [_, x1, y1, x2, y2] = match.map(Number);
    return {x1, y1, x2, y2};
});

console.log("part2", count(input, true));
