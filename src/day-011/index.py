with open("input.txt") as file:
    lines = file.read().splitlines()

grid = []

for line in lines:
    grid.append([int(item) for item in line])


def print_grid():
    for x in grid:
        print(x)


GRID_LENGTH = len(grid)
DIRS = [
    [0, -1],  # top
    [0, 1],  # bottom
    [-1, 0],  # left
    [1, 0],  # right
    [1, -1],  # top right
    [-1, -1],  # top left
    [1, 1],  # bottom right
    [-1, 1],  # bottom left
]

DIRS_LENGTH = len(DIRS)

ROW_INDEX = 0
COLUMN_INDEX = 1

already_flash = [list(map(lambda x: False, r)) for r in grid]


def print_flashed():
    for x in range(GRID_LENGTH):
        flashes = list(map(lambda n: "#" if n else ".", already_flash[x]))
        print("".join(flashes))


def simulate_step():
    flash_count = 0
    increase_grid()  # increase every octopus by one
    global already_flash
    already_flash = [list(map(lambda _x: False, _row)) for _row in grid]
    should_stop = False
    while not should_stop:
        should_stop = True
        for x in range(GRID_LENGTH):
            for y in range(GRID_LENGTH):
                if grid[x][y] > 9:
                    # flash
                    grid[x][y] = 0
                    flash_count += 1
                    already_flash[x][y] = True
                    increase_adjacent(x, y)
                    should_stop = False  # continue flashing
    return flash_count


def increase_grid():
    for x in range(GRID_LENGTH):
        for y in range(GRID_LENGTH):
            grid[x][y] += 1


def increase_adjacent(x: int, y: int):
    for i in range(DIRS_LENGTH):
        row = x + DIRS[i][ROW_INDEX]
        col = y + DIRS[i][COLUMN_INDEX]
        if 0 <= row < GRID_LENGTH and 0 <= col < GRID_LENGTH and not already_flash[row][col]:
            grid[row][col] += 1


def part1(times: int, graph: bool = False, use_flashes: bool = False):
    print_grid()
    flashes = 0
    for i in range(times):
        print(f"step {i + 1}") if graph else None
        flashes += simulate_step()
        if graph:
            print_flashed() if use_flashes else print_grid()
        print("-.-" * 10) if graph else None
    print(f"flashes: {flashes}")


def all_are_flashing():
    all_flashing = True
    for row in already_flash:
        for flash in row:
            if not flash:
                all_flashing = False
    return all_flashing


def part2():
    print_grid()
    step = 0
    while not all_are_flashing():
        simulate_step()
        step += 1
    print(f"step: {step}")


# part1(times=3, graph=True, use_flashes=True)  # use to debug

part1(times=100)

part2()
