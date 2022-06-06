from typing import List, Tuple, Set

with open("input.txt") as file:
    lines = file.readlines()

Point = Tuple[int, int]
points: Set[Point] = set()
instructions: List[Point] = []

for line in lines:
    line = line.strip()
    if len(line) == 0:
        continue

    if line.startswith("fold"):
        ins, value = line.split("=")
        if ins.endswith("y"):
            instructions.append((0, int(value)))
        else:
            instructions.append((int(value), 0))
    else:
        x, y = line.split(",")
        x, y = int(x), int(y)
        points.add((x, y))


def print_input(instructions: List[Point], points: Set[Point]):
    for i in instructions:
        print(f"fold {i}")

    for p in points:
        print(p, end=" ")


def mirror_point(p: Point, ins: Point) -> Point:
    fx, fy = ins
    px, py = p

    if fx != 0:
        return p if px < fx else (fx * 2 - px, py)
    else:
        return p if py < fy else (px, fy * 2 - py)


def fold_paper(ins: Point, points: Set[Point]) -> Set[Point]:
    return set(mirror_point(p, ins) for p in points)


def part_1(i: List[Point], points: Set[Point]):
    print(f"folding: {i[0]}")
    points = fold_paper(i[0], points)
    print("points:", len(points))


def part_2(instructions: List[Point], points: Set[Point]):
    for i in instructions:
        points = fold_paper(i, points)

    max_x = max([p[0] for p in points])
    max_y = max([p[1] for p in points])

    for y in range(0, max_y + 2):
        for x in range(0, max_x + 2):
            print("X", end=" ") if (x, y) in points else print(" ", end=" ")
        print()


part_1(instructions, points)
part_2(instructions, points)
