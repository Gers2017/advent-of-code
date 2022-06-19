import { get_input } from "../utils/helpers.ts";

interface Command {
    name: string;
    value: number;
}

class Submarine {
    horizontal = 0;
    depth = 0;
    aim = 0;

    constructor(public commands: Command[]) {
        this.commands = commands;
    }

    parse_commands(use_aim: number) {
        this.commands.forEach((command) => {
            const { name, value } = command;
            if (name == "forward") {
                this.horizontal += value;
                if (use_aim) this.depth += this.aim * value;
            }
            if (name == "up") {
                if (use_aim) this.aim -= value;
                else this.depth -= value;
            }
            if (name == "down") {
                if (use_aim) this.aim += value;
                else this.depth += value;
            }
        });
    }
}
const commands = get_input(0).map<Command>((line) => {
    const [name, value] = line.split(" ");
    return { name, value: Number(value) };
});

function solve_part1(commands: Command[]) {
    const submarine = new Submarine(commands);
    submarine.parse_commands(0);
    console.log("Part1:", submarine.horizontal * submarine.depth);
}

function solve_part2(commands: Command[]) {
    const submarine = new Submarine(commands);
    submarine.parse_commands(1);
    console.log("Part2:", submarine.horizontal * submarine.depth);
}

solve_part1(commands);
solve_part2(commands);
