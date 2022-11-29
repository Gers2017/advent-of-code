from typing import List
from queue import PriorityQueue

DEBUG = False

with open("test_input.txt" if DEBUG else "input.txt") as f:
    text = f.read().strip()
    lines = text.split("\n")

# generate the grid, using the lines as rows

risk_graph = [[int(n) for n in line] for line in lines]

row_length = len(risk_graph[0])
column_length = len(risk_graph)

directions = [
    [1, 0],  # right
    [-1, 0],  # left
    [0, -1],  # top
    [0, 1],  # bottom
]

dir_length = len(directions)

visited_points = []


def dk():
    D = {(_x, _y): float("inf") for _x in range(row_length) for _y in range(column_length)}
    start_point = (0, 0)
    D[start_point] = 0

    pq = PriorityQueue()
    pq.put((0, start_point))

    while not pq.empty():
        # get a point with the lowest distance to the start point
        (dist, current_point) = pq.get()
        visited_points.append(current_point)

        x, y = current_point

        # if the new distance is lower than the old distance,
        # update the neighbour distance as D[next_point] = new_distance
        # the new distance is D[current_point] + risk[next_y][next_x]
        # set node as visited

        for i in range(dir_length):
            direction = directions[i]
            x_dir = direction[0]
            y_dir = direction[1]

            next_x = x + x_dir
            next_y = y + y_dir
            next_point = (next_x, next_y)

            if next_x < 0 or next_x >= row_length or next_y < 0 or next_y >= column_length \
                    and next_point not in visited_points:
                continue
            old_distance = D[next_point]
            new_distance = D[current_point] + risk_graph[next_y][next_x]

            if new_distance < old_distance:
                pq.put((new_distance, next_point))
                D[next_point] = new_distance

    print("Final Node Reached")
    print(f"Minimum risk path {D[(column_length - 1, row_length - 1)]}")


def increment(ls: List):
    return list(map(lambda x: x + 1 if x + 1 <= 9 else 1, ls))


def extend(_grid, to=1):
    row_range = len(_grid[0])
    column_range = len(_grid)

    for _ in range(to):
        for y in range(column_range):
            row = _grid[y]
            inc_row = increment(row[-row_range:])
            _grid[y] += inc_row

    for _ in range(to):
        rows = _grid[-column_range:]
        for row in rows:
            bottom_row = increment(row)
            _grid.append(bottom_row)


def part1():
    dk()


def part2():
    extend(risk_graph, 4)
    global column_length
    global row_length
    column_length = len(risk_graph)
    row_length = len(risk_graph[0])

    dk()


# part1()

part2()

'''
start-> $163751742
        1381373672
        2136511328
        3694931569
        7463417111
        1319128137
        1359912421
        3125421639
        1293138521
        231194458E <- end
'''
