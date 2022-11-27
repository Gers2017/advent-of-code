from lib import parse_input, next_move, StrList, print_board_ls, board_to_str
from queue import PriorityQueue


def organize(start_board: StrList, target_board: str):
    start_str = board_to_str(start_board)
    memo = {start_str: 0}
    queue = PriorityQueue()
    queue.put((0, start_board))
    times_reached_last_step = 0
    last_best_cost = float("inf")

    while not queue.empty():

        _, board = queue.get()
        board_str = board_to_str(board)

        for step in next_move(board):
            if not memo.get(step.board, False):
                memo[step.board] = memo[board_str] + step.cost
                queue.put((
                    memo[step.board], step.board.splitlines()
                ))
            else:
                new_cost = memo[board_str] + step.cost
                prev_cost = memo[step.board]
                if prev_cost > new_cost:
                    memo[step.board] = new_cost
                    queue.put((
                        memo[step.board], step.board.splitlines()
                    ))

                    if memo.get(target_board, False):
                        if memo[target_board] < last_best_cost:
                            last_best_cost = memo[target_board]
                            times_reached_last_step += 1

                            print("Reached last state!")
                            print("New Minimum cost:", memo[target_board])
                            if times_reached_last_step >= 3:
                                return memo[target_board]

    return memo[target_board]


target_part1 = """
#############
#...........#
###A#B#C#D###
###A#B#C#D###
#############
""".strip()

target_part2 = """
#############
#...........#
###A#B#C#D###
###A#B#C#D###
###A#B#C#D###
###A#B#C#D###
#############
""".strip()


def basic_test():
    raw_text = """
#############
#...........#
###A#D#B#C###
###D#C#B#A###
###D#B#A#C###
###B#C#D#A###
#############
""".strip()
    board = parse_input(raw_text)
    result = organize(board, target_part2)
    print("Minimum cost:", result)


def part_1():
    is_test = True
    with open("input_test.txt" if is_test else "input.txt") as f:
        raw_text = f.read().strip()
    print(raw_text)
    print()
    print(target_part1)
    board = parse_input(raw_text)
    result = organize(board, target_part1)
    print("Minimum cost:", result)


def part_2():
    is_test = True
    with open("input_p2_test.txt" if is_test else "input_p2.txt") as f:
        raw_text = f.read().strip()
    print(raw_text)
    print()
    print(target_part2)
    board = parse_input(raw_text)
    result = organize(board, target_part2)
    print("Minimum cost:", result)


basic_test()
# part_1()
# part_2()
