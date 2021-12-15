from typing import List
from board import Board

is_test = False
log = False

MARKED_VALUES: List[int] = []

with open("test_maked_input.txt" if is_test else "marked_input.txt", "r") as file:
    MARKED_VALUES = list(map(int, file.read().split(",")))

with open("test_boards_input.txt" if is_test else "boards_input.txt", "r") as file:
    lines = file.readlines()

boards = []
current_board = []

for line in lines:
    if line == "\n":
        if log: print("-" * 28)
        boards.append(current_board)
        current_board = []
    else:
        line_arr = line.replace("\n", "").split(" ")
        filter_arr = list(filter(lambda x: len(x) > 0, line_arr))
        numbers = list(map(int, filter_arr))
        if log: print("|" * 2, numbers, "|" * 2)
        current_board.append(numbers)

if log: print("- - -" * 20)

board_instances: List[Board] = []

for j in range(len(boards)):
    b = boards[j]
    board_instances.append(Board("board_" + str(j), b))

winner_boards: List[Board] = []

for maked_value in MARKED_VALUES:
    for b in board_instances:  # every board instance calculates if it's the winner
        if b in winner_boards:
            continue
        won, values, m_values = b.is_winner(maked_value)

        if won:
            winner_boards.append(b)

for b in winner_boards:
    print(f"ID: {b.name} score: {b.score}, values: {b.winner_values} m_values: {b.marked_values}")
