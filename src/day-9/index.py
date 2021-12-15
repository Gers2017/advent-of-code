# using bitbucket to escape from github
# source from https://bitbucket.org/gers2017/aoc21/src/main/day-9/index.py
from typing import List

debug = False
file_dir = "./test_input.txt" if debug else "./input.txt"

with open(file_dir) as file:
    _input = file.read()

grid = []

for line in _input.splitlines():
    grid.append(list(map(int, list(line))))

ROW_LENGTH = len(grid)
COLUMN_LENGTH = len(grid[0])

ROW_INDEX = 0
COL_INDEX = 1
DIRS = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
]
DIR_LENGTH = len(DIRS)


def is_lowest_point(x: int, y: int) -> bool:
    point = grid[x][y]

    for i in range(DIR_LENGTH):
        row = x + DIRS[i][ROW_INDEX]
        column = y + DIRS[i][COL_INDEX]

        if 0 <= row < ROW_LENGTH and 0 <= column < COLUMN_LENGTH:
            neighbour = grid[row][column]
            if neighbour <= point:
                return False

    return True


def part1():
    risk_levels = []
    for x in range(ROW_LENGTH):
        for y in range(COLUMN_LENGTH):
            if is_lowest_point(x, y):
                risk_levels.append(grid[x][y] + 1)
    return sum(risk_levels)


visited_map: List[List[bool]] = []
for row in grid:
    bool_column = list(map(lambda x: x > 9, row))
    visited_map.append(bool_column)


def part2():
    basin_list: List[Basin] = []
    for x in range(ROW_LENGTH):
        for y in range(COLUMN_LENGTH):
            if is_lowest_point(x, y):
                basin = Basin(grid[x][y])
                traverse_basin(x, y, basin)
                basin_list.append(basin)

    lg_basins = sorted(list(map(lambda b: b.size, basin_list)), reverse=True)
    return lg_basins[0] * lg_basins[1] * lg_basins[2]


class Basin:
    def __init__(self, root: int) -> None:
        self.size = 0
        self.nodes = [root]

    def increase_size(self):
        self.size += 1

    def add_node(self, node: int):
        self.nodes.append(node)


def traverse_basin(x: int, y: int, basin: Basin):
    if visited_map[x][y]:
        return

    visited_map[x][y] = True  # already visited
    basin.increase_size()

    point = grid[x][y]

    for i in range(DIR_LENGTH):
        row = x + DIRS[i][ROW_INDEX]
        column = y + DIRS[i][COL_INDEX]

        if 0 <= row < ROW_LENGTH and 0 <= column < COLUMN_LENGTH:
            neighbour = grid[row][column]
            if point <= neighbour < 9:
                traverse_basin(row, column, basin)


def print_basins():
    for y in range(ROW_LENGTH):
        basins = list(map(lambda n: "#" if n else ".", visited_map[y]))
        print("".join(basins))


print(f"part1 {part1()}")
print(f"part2 {part2()}")
print_basins()
