from typing import List, Dict, Tuple

Point = Tuple[int, int]

IS_TEST = False
FILE = "input_test.txt" if IS_TEST else "input.txt"

with open(FILE) as f:
    lines: List[str] = f.read().strip().splitlines()

MAX_GRID_Y = len(lines)
MAX_GRID_X = len(lines[0])


def parse_input(_input: List[str]) -> Dict[Point, str]:
    m: Dict[Point, str] = {}
    ROWS = len(_input)
    COLS = len(_input[0])

    for y in range(ROWS):
        for x in range(COLS):
            if _input[y][x] != ".":
                m[(x, y)] = _input[y][x]

    return m


def move_right(point: Point) -> Point:
    x, y = point
    return (0, y) if x + 1 >= MAX_GRID_X else (x + 1, y)


def move_down(point: Point) -> Point:
    x, y = point
    return (x, 0) if y + 1 >= MAX_GRID_Y else (x, y + 1)


def simulate(grid: Dict[Point, str]) -> Dict[Point, str]:
    # 1: use the New Map
    # 2: generate the previous and next points
    # 3: filter next points to only the ones missing in New Map
    # 4: update the New Map accordingly
    # 5: repeat for horizontal and vertical

    new_grid: Dict[Point, str] = grid.copy()

    prev_x_points: List[Point] = [p for p, c in new_grid.items() if c == ">"]
    next_x_points: List[Point] = [move_right(p) for p in prev_x_points]
    zipped = [(prev, nxt) for prev, nxt in zip(prev_x_points, next_x_points)
              if new_grid.get(nxt, None) == None]

    for (prev, nxt) in zipped:
        del new_grid[prev]
        new_grid[nxt] = ">"

    prev_y_points: List[Point] = [p for p, c in new_grid.items() if c == "v"]
    next_y_points: List[Point] = [move_down(p) for p in prev_y_points]

    zipped = [(prev, nxt) for prev, nxt in zip(prev_y_points, next_y_points)
              if new_grid.get(nxt, None) == None]

    for (prev, nxt) in zipped:
        del new_grid[prev]
        new_grid[nxt] = "v"

    return new_grid


def are_grids_equal(a: Dict[Point, str], b: Dict[Point, str]) -> bool:
    for y in range(MAX_GRID_Y):
        for x in range(MAX_GRID_X):
            p = (x, y)
            ch1 = a.get(p, None)
            ch2 = b.get(p, None)
            if ch1 != ch2:
                return False

    return True


def print_grid(grid: Dict[Point, str]):
    for y in range(MAX_GRID_Y):
        for x in range(MAX_GRID_X):
            p = (x, y)
            if grid.get(p, None) != None:
                print(grid[p], end="")
            else:
                print(".", end="")
        print()


def simulate_n_times(_input: List[str], n: int, log: bool = True, log_final: bool = False):
    grid: Dict[Point, str] = parse_input(_input)

    if log:
        print("---"*4, " INITIAL STATE")
        print_grid(grid)

    for i in range(1, n + 1):
        grid = simulate(grid)
        if log:
            print("---"*4, f" STEP {i} ", "---"*4)
            print_grid(grid)

    if log_final:
        print("---"*4, f" STEP {n} ", "---"*4)
        print_grid(grid)


def solution(_input: List[str], log_final: bool = False):
    grid: Dict[Point, str] = parse_input(_input)
    prev_grid: Dict[Point, str] = {}
    stop_moving = False
    times = 0

    while not stop_moving:
        prev_grid = grid
        grid = simulate(grid)
        times += 1

        if are_grids_equal(prev_grid, grid):
            stop_moving = True

    print(f"Loops: {times}")
    if log_final:
        print("----" * 4)
        print_grid(grid)
        print("----" * 4)


# simulate_n_times(lines, 58, log=False, log_final=True)
solution(lines)
