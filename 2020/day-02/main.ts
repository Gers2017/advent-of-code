type Password = {
    letter: string
    range: [number, number],
    text: string
}

function NewPassword(letter: string, from: number, to: number, text: string): Password {
    return { letter, range: [from, to], text }
}

function IsPasswordValid(pass: Password) {
    const { letter, range, text } = pass;
    const f = text.split("").filter(ch => ch === letter)
    const [min, max] = range;
    return f.length <= max && f.length >= min
}

function IsPasswordValidPart2(pass: Password) {
    const { letter, range, text } = pass;
    const [a, b] = range;

    return text[a - 1] === letter && text[b - 1] !== letter ||
        text[b - 1] === letter && text[a - 1] !== letter
}

function getInput() {
    const lines = Deno.readTextFileSync("input.txt").split("\n")
    return lines.map(it => {
        const [policy, passwordText] = it.split(":");
        const [range, letter] = policy.split(" ")
        const [from, to] = range.split("-").map(Number)
        return NewPassword(letter.trim(), from, to, passwordText.trim())
    })
}
const testPasswords = [NewPassword("a", 1, 3, "abcde"), NewPassword("b", 1, 3, "cdefg"), NewPassword("c", 2, 9, "ccccccccc")]
const isTest = false
const isPartTwo = true
const passwords = isTest ? testPasswords : getInput();

let validCount = 0;

for (const password of passwords) {
    if (isPartTwo) {
        if (IsPasswordValidPart2(password)) validCount++;
    } else {
        if (IsPasswordValid(password)) validCount++;
    }

}

console.log("valid passwords", validCount)

