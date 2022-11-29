import { Cuboids, new_cuboid, new_range } from "./lib.ts";
import { get_input, InputMode } from "../utils/helpers.ts";

function getAllCuboids(inputMode: InputMode): Cuboids {
    return get_input(inputMode).map((line) => {
        const isOn = line.startsWith("on");
        const match = line.match(/[-]?\d+\.\.[-]?\d+/gm);
        if (!match) {
            throw Error(`Invalid input, cannot extract points: ${line}`);
        }

        const numbers = match
            ?.map((point) => point.split("..").map(Number))
            .flat()!;
        const [x1, x2, y1, y2, z1, z2] = numbers;
        const xRange = new_range(x1, x2);
        const yRange = new_range(y1, y2);
        const zRange = new_range(z1, z2);
        return new_cuboid(isOn, xRange, yRange, zRange);
    });
}

function solve(cuboids: Cuboids) {
    const volumes: Cuboids = [];

    cuboids.forEach((cuboid) => {
        const toAdd = volumes.reduce<Cuboids>((ls, current) => {
            const intersection = current.intersect(cuboid);
            return intersection ? [...ls, intersection] : ls;
        }, []);

        volumes.push(...toAdd);

        if (cuboid.isOn) volumes.push(cuboid);
    });

    return volumes.map((it) => it.volume()).reduce((a, b) => a + b, 0);
}
const allCuboids = getAllCuboids(InputMode.Real);

solvePart1(allCuboids);
solvePart2(allCuboids);

function solvePart1(allCuboids: Cuboids) {
    const baseArea = new_cuboid(
        true,
        new_range(-50, 50),
        new_range(-50, 50),
        new_range(-50, 50)
    );
    const part1Cuboids = allCuboids.filter((it) => it.intersect(baseArea));
    console.log("Part 1:", solve(part1Cuboids));
}

function solvePart2(allCuboids: Cuboids) {
    console.log("Part 2:", solve(allCuboids));
}
