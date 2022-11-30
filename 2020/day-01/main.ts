async function getInput(isTest: boolean) {
    if (isTest) return [1721, 979, 366, 299, 675, 1456];

    const text = await Deno.readTextFile("input.txt");
    return text.split("\n").map(Number);
}

type Result = { ok: boolean; value: number };

function FindEntries(
    i: number,
    j: number,
    collection: number[],
    isPartTwo: boolean
): Result {
    const a = collection[i];
    const b = collection[j];

    if (isPartTwo) {
        for (let k = j + 1; k < collection.length; k++) {
            const c = collection[k];
            if (a + b + c === 2020) {
                // console.log(">Found", a, b, c);
                return { ok: true, value: a * b * c };
            }
        }
    } else {
        if (a + b === 2020) {
            // console.log(">Found", a, b);
            return { ok: true, value: a * b };
        }
    }

    return { ok: false, value: -1 };
}

let result = 0;
const isPartTwo = false;
const collection = await getInput(false);

for (let i = 0; i < collection.length; i++) {
    for (let j = i + 1; j < collection.length; j++) {
        const { ok, value } = FindEntries(i, j, collection, isPartTwo);

        if (ok) {
            result = value;
        }
    }
}

console.log("Result:", result);
