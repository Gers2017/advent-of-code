from typing import List, Tuple, Set, Dict
# Board = List[List[str]]
StrList = List[str]

Point2D = Tuple[int, int]
PathResult = Tuple[List[Point2D], bool]
HomeResult = Tuple[Point2D, bool]
HomePathResult = Tuple[Point2D, int, bool]

# CHANGE THIS TO SOLVE  PART 1
IS_PART_2 = True

# Constants -----
WALL = "#"
EMPTY_SPACE = "."

MIN_Y_DEPTH_ROOM = 2
MAX_Y_ROOM_DEPTH = 5 if IS_PART_2 else 3

AMPHIPODS_CHARS = ["A", "B", "C", "D"]
HOME_CH_TO_ROOM_ENTRY = {"A": (3, 2), "B": (5, 2), "C": (7, 2), "D": (9, 2)}
ROOM_X_TO_HOME_CH = {3: "A", 5: "B", 7: "C", 9: "D"}
HALLWAY_POINTS = [(1, 1), (2, 1), (4, 1), (6, 1),
                  (8, 1), (10, 1), (11, 1)]

ROOM_A = [(3, y) for y in range(MIN_Y_DEPTH_ROOM, MAX_Y_ROOM_DEPTH + 1)]
ROOM_B = [(5, y) for y in range(MIN_Y_DEPTH_ROOM, MAX_Y_ROOM_DEPTH + 1)]
ROOM_C = [(7, y) for y in range(MIN_Y_DEPTH_ROOM, MAX_Y_ROOM_DEPTH + 1)]
ROOM_D = [(9, y) for y in range(MIN_Y_DEPTH_ROOM, MAX_Y_ROOM_DEPTH + 1)]

ROOM_POINTS = ROOM_A + ROOM_B + ROOM_C + ROOM_D
HOME_CH_TO_ROOM = {"A": ROOM_A, "B": ROOM_B, "C": ROOM_C, "D": ROOM_D}
ENERGY_TABLE = {"A": 1, "B": 10, "C": 100, "D": 1000}
DIRS = [(-1, 0), (1, 0), (0, 1), (0, -1)]

# Functions ------


def _explore(board: StrList, current: Point2D, target: Point2D, seen: Dict[Point2D, bool], path: List[Point2D]):
    # base case!
    x, y = current
    if x < 0 or x >= len(board[0]) or y < 0 or y >= len(board):
        return False

    if board[y][x] == WALL or seen.get(current, False):
        return False

    # Ignore starting amphipod, panic if there's a amphipod in the path
    if len(path) > 0 and board[y][x] in AMPHIPODS_CHARS:
        return False

    # pre-recurse
    seen[current] = True
    path.append(current)

    if current == target:
        return True

    for dx, dy in DIRS:
        nx, ny = x + dx, y + dy
        # recursion
        if _explore(board, (nx, ny), target, seen, path):
            return True  # skip pop bellow

    path.pop()  # remove invalid path
    return False


def find_path(board: StrList, source: Point2D, target: Point2D) -> PathResult:
    seen = {}
    path = []
    found = _explore(board, source, target, seen, path)
    return (path, found)
# End of Pathfinder ----


def parse_input(raw_text: str) -> StrList:
    return [l for l in raw_text.strip().splitlines()]


def manhattan_dist(a, b):
    x1, y1 = a
    x2, y2 = b
    return abs(x2 - x1) + abs(y2 - y1)


def get_home_entry_by_ch(home_ch: str):
    return HOME_CH_TO_ROOM_ENTRY[home_ch]


def get_energy_of(ch: str):
    assert ch in AMPHIPODS_CHARS
    return ENERGY_TABLE[ch]


def sorted_by_distance_to_home(points: List[Point2D], home_point: Point2D):
    return sorted(points, key=lambda p: manhattan_dist(p, home_point))


def get_closest_points_to_home(board: StrList, home_ch: str):
    home_entry = get_home_entry_by_ch(home_ch)
    search_points = [p for p in HALLWAY_POINTS]
    points = [(x, y) for (x, y) in search_points if board[y][x] == EMPTY_SPACE]
    return sorted_by_distance_to_home(points, home_entry)


def is_in_hallway(y):
    return y == 1


def is_inside_valid_room(board: StrList, x: int):
    home_ch = ROOM_X_TO_HOME_CH[x]
    for x, y in HOME_CH_TO_ROOM[home_ch]:
        if board[y][x] not in [home_ch, EMPTY_SPACE]:
            return False
    return True


def can_move_to_hallway(board: StrList, x: int, y: int):
    # Can't call from outside a room!
    assert (x, y) in ROOM_POINTS
    left = x - 1
    right = x + 1
    empty_corners = board[1][left] == EMPTY_SPACE or board[1][right] == EMPTY_SPACE
    empty_path_out = all(
        [board[dy][x] == EMPTY_SPACE for dy in range(MIN_Y_DEPTH_ROOM, y)])
    return empty_corners and empty_path_out


# def is_home_room_valid(board: StrList, home_ch: str):
#     for x, y in HOME_CH_TO_ROOM[home_ch]:
#         if not board[y][x] in [EMPTY_SPACE, home_ch]:
#             return False
#     return True


def get_home_point(board: StrList, home_ch: str) -> HomeResult:
    # Assume that is called from Rooms and Hallway points
    home_x, _ = get_home_entry_by_ch(home_ch)
    point = (-1, -1)
    for dy in range(MIN_Y_DEPTH_ROOM, MAX_Y_ROOM_DEPTH + 1):
        if board[dy][home_x] == EMPTY_SPACE:
            point = (home_x, dy)
    return (point, False) if point == (-1, -1) else (point, True)


def calculate_room_cost(board: StrList, my_x: int, my_y: int):
    if my_y == MIN_Y_DEPTH_ROOM - 1:  # Hallway Y pos
        current_ch = board[my_y][my_x]
        home_entry = HOME_CH_TO_ROOM_ENTRY[current_ch]
        room_exit = (my_x, my_y)
        return manhattan_dist((my_x, my_y), home_entry) * get_energy_of(current_ch)

    total_cost = 0
    room_ch = ROOM_X_TO_HOME_CH[my_x]
    room_exit = (my_x, MIN_Y_DEPTH_ROOM - 1)
    for x, y in HOME_CH_TO_ROOM[room_ch]:
        if board[y][x] == EMPTY_SPACE:
            continue

        current_ch = board[y][x]
        current_pos = (x, y)

        if y == MAX_Y_ROOM_DEPTH and current_ch == room_ch:
            continue
        if current_ch == room_ch:  # Same room
            dist = manhattan_dist(room_exit, current_pos) + \
                1  # Adjust for hallway
            total_cost += dist * get_energy_of(current_ch)
        else:  # calculate for desired room
            hx, _ = HOME_CH_TO_ROOM_ENTRY[current_ch]
            # Adjust for hallway
            dist = manhattan_dist((hx, MIN_Y_DEPTH_ROOM - 1), current_pos) + 1
            total_cost += dist * get_energy_of(current_ch)

    return total_cost


def get_points_to_move(board: StrList) -> List[Point2D]:
    points = []

    for x, y in ROOM_POINTS + HALLWAY_POINTS:
        current_ch = board[y][x]
        current_pos = (x, y)
        if not current_ch in AMPHIPODS_CHARS:
            continue

        if is_in_hallway(y):
            points.append(current_pos)
        elif can_move_to_hallway(board, x, y) and not is_inside_valid_room(board, x):
            points.append(current_pos)

    # return points
    def sort_by_move_cost(p):
        px, py = p
        p_ch = board[py][px]
        assert p_ch in AMPHIPODS_CHARS
        hx, hy = get_home_entry_by_ch(p_ch)
        dist = manhattan_dist((hx, hy - 1), p)
        return get_energy_of(p_ch) * dist
    # def sort_by_room_cost(p):
    #     return calculate_room_cost(board, p[0], p[1])

    return sorted(points, key=sort_by_move_cost)


def find_path_to_home(board: StrList, source: Point2D, home_ch: str) -> HomePathResult:
    home_point, ok = get_home_point(board, home_ch)
    bad_home_point = (-1, -1)
    if not ok:
        return (bad_home_point, 0, False)

    if not is_inside_valid_room(board, home_point[0]):
        return (bad_home_point, 0, False)

    path, ok = find_path(board, source, home_point)
    if not ok:
        return (bad_home_point, 0, False)

    return (home_point, len(path) - 1, True)


def is_complete(board: StrList):
    for am_ch in AMPHIPODS_CHARS:
        for x, y in HOME_CH_TO_ROOM[am_ch]:
            if board[y][x] != am_ch:
                return False
    return True


def move_amphipod(board: StrList, source: Point2D, am_ch: str, target: Point2D) -> StrList:
    lines_cp: StrList = []
    am_x, am_y = source
    tar_x, tar_y = target

    for y in range(len(board)):
        line = ""
        for x in range(len(board[0])):
            ch = board[y][x]
            if x == am_x and y == am_y:
                ch = EMPTY_SPACE
            elif tar_x == x and tar_y == y:
                ch = board[am_y][am_x]
            line += ch
        lines_cp.append(line)
    return lines_cp


def print_board_ls(b: StrList):
    for row in b:
        print(row)


def board_to_str(board: StrList):
    return "\n".join(board)

# Step class ------


class Step:
    board: str
    cost: int

    def __init__(self, board: str, cost: int):
        self.board = board
        self.cost = cost


def travel_step(s: Step, costs: Set[int], cost_so_far: int):
    cost_so_far += s.cost
    print(f"->{s.cost} | {cost_so_far}")

    if s.is_end():
        costs.add(cost_so_far)
        cost_so_far = 0
        print("---" * 4)
        return

    for ns in s.next_steps:
        travel_step(ns, costs, cost_so_far)


def get_minimum_cost(root_step: Step) -> int:
    costs = set()
    travel_step(root_step, costs, 0)
    return min(costs)


def next_move(board: StrList) -> List[Step]:
    steps: List[Step] = []

    for current_pos in get_points_to_move(board):
        x, y = current_pos
        current_ch = board[y][x]
        # print(f"Current: {current_ch} {current_pos}")

        home_pos, dist, ok = find_path_to_home(board, current_pos, current_ch)

        if ok:
            cost = dist * get_energy_of(current_ch)
            board_str = board_to_str(move_amphipod(
                board, current_pos, current_ch, home_pos))

            # print(
            #     f"{current_ch} {current_pos} -> {home_pos} *{cost} *Home")
            steps.append(Step(
                board_str,
                cost
            ))

        for cp in get_closest_points_to_home(board, current_ch):
            if is_in_hallway(y):
                continue

            path_to_closest, ok = find_path(board, current_pos, cp)
            if not ok:
                continue

            dist, energy = len(path_to_closest) - 1, get_energy_of(current_ch)
            cost = dist * energy
            # print(f"{current_ch} {current_pos} -> {cp} *{cost}")

            board_str = board_to_str(move_amphipod(
                board, current_pos, current_ch, cp))
            steps.append(Step(
                board_str,
                cost
            ))
    # return steps[:10]
    return steps
