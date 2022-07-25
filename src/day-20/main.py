from typing import List


def get_input(use_test=True) -> List[str]:
    filename = "input_test.txt" if use_test else "input.txt"
    with open(filename) as file:
        input = file.read().strip().splitlines()
    return input


class Grid:
    rows: List[str]
    rows_count: int
    cols_count: int

    def __init__(self, rows: List[str]) -> None:
        self.rows = rows
        self._update_count()

    def _update_count(self):
        self.rows_count = len(self.rows)
        self.cols_count = len(self.rows[0])

    def contains(self, x: int, y: int) -> bool:
        return (0 <= y < self.rows_count) and (0 <= x < self.cols_count)

    def get(self, x: int, y: int, default: str) -> str:
        if not self.contains(x, y):
            return default
        return self.rows[y][x]

    def get_area(self, x: int, y: int, default: str) -> List[str]:
        def get(x, y): return self.get(x, y, default)

        return [
            get(x - 1, y - 1), get(x, y - 1), get(x + 1, y - 1),
            get(x - 1, y), get(x, y), get(x + 1, y),
            get(x - 1, y + 1), get(x, y + 1), get(x + 1, y + 1),
        ]

    def print(self):
        for row in self.rows:
            print("".join([bit_to_pixel(x) for x in row]))
        print("---" * 12)


def print_area(area: List[str]):
    print(area[:3])
    print(area[3:6])
    print(area[6:9])


def pixel_to_bit(ch: str) -> str:
    return "1" if ch == "#" else "0"


def bit_to_pixel(ch: str) -> str:
    return "#" if ch == "1" else "."


def enhance(grid: Grid, algo: List[str], default: str) -> Grid:
    def get_bit_at(x: int, y: int) -> str:
        area = grid.get_area(x, y, default)
        bits = "".join(area)
        index = int(bits, 2)
        return algo[index]

    image_output: List[str] = []
    for y in range(-3, grid.rows_count + 3):
        row = "".join([get_bit_at(x, y)
                      for x in range(-3, grid.cols_count + 3)])
        image_output.append(row)

    return Grid(image_output)


def simulate(grid: Grid, algo: str, times=2):
    default = "0"

    for _ in range(times):
        grid = enhance(grid, algo, default)
        default = algo[0] if default == "0" else algo[len(algo) - 1]

    count = 0
    for y in range(3, grid.rows_count - 3):
        for x in range(3, grid.cols_count - 3):
            if grid.get(x, y, "0") == "1":
                count += 1

    print(f"ligths: {count} after {times} iterations")


def line_to_bits(line: str): return "".join([pixel_to_bit(ch) for ch in line])


input = get_input(use_test=True)
first, lines = (input[0], input[2:])
algo = "".join([pixel_to_bit(ch) for ch in first])
grid = Grid([line_to_bits(line) for line in lines])
simulate(grid, algo, 50)
