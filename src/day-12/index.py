from typing import List, Tuple

'''
  graph made by python gang™
  start-A
  start-b
  A-c
  A-b
  b-d
  A-end
  b-end

    start
    /   \ 
c--A-----b--d
    \   /
     end

  start -> A -> end
           A -> c -> A -> end
           A -> c -> A -> b -> end
           A -> c -> A -> b -> A -> end
           A -> b -> end
           A -> b -> A -> end
           A -> b -> A -> c -> A -> end

  start -> b -> end
        -> b -> A -> end
        -> b -> A -> c -> A -> end
'''


def get_lines(dev: bool = True):
    with open("test_input.txt" if dev else "input.txt") as file:
        lines = file.read().splitlines()
    return lines


def get_tuple(line) -> Tuple[str, str]:
    return line.split("-")


def get_items_count():
    items = set()
    for line in get_lines():
        a, b = get_tuple(line)
        items.add(a)
        items.add(b)

    return len(items)


def get_filled_vertices():
    items_count = get_items_count()
    _vertices = []
    for y in range(items_count):
        _vertices.append([False for x in range(items_count)])
    return _vertices


vert_index_ctn = 2  # count start on 2 because of the start and end keys
vertices_index = {"start": 0, "end": 1}
index_vertices = {0: "start", 1: "end"}


# returns the index of a key, if the key in None creates a new one returning the current index
def get_v_index(key: str):
    global vert_index_ctn

    if vertices_index.get(key) is None:
        vertices_index[key] = vert_index_ctn
        index_vertices[vert_index_ctn] = key
        vert_index_ctn += 1

    return vertices_index[key]


def is_lower(index):
    return index_vertices[index].islower()


def is_big(index):
    return index_vertices[index].isupper()


def print_vert_dict():
    for k in vertices_index.keys():
        print(f"Name: {k} : [ {vertices_index[k]} ]")


def print_vertices():
    print("---" * len(vertices))
    header = [str(i) for i in range(len(vertices))]
    print(f"<{'  '.join(header)}>")
    for cols in vertices:
        print([1 if n else 0 for n in cols])
    print("---" * len(vertices))


vertices = get_filled_vertices()
for line in get_lines():
    a, b = get_tuple(line)
    a_index = get_v_index(a)
    b_index = get_v_index(b)

    vertices[b_index][a_index] = True
    vertices[a_index][b_index] = True
    # if not (a.islower() and b.islower()):

vertices_length = len(vertices)


# util function to fill the visited indexes with False
def get_blank_visited_indexes():
    return [False for i in range(vertices_length)]


visited_indexes = get_blank_visited_indexes()
paths_count = 0


def traverse_vertices(v_index):
    if v_index == get_v_index("end"):
        global paths_count
        paths_count += 1
        return

    for i in range(vertices_length):
        if vertices[v_index][i] and not visited_indexes[i]:
            if is_lower(i):
                visited_indexes[i] = True
            traverse_vertices(i)
            visited_indexes[i] = False


def traverse_vertices_part2(v_index, visit_twice):
    if v_index == get_v_index("end"):
        global paths_count
        paths_count += 1
        return

    for i in range(vertices_length):
        is_connected = vertices[v_index][i]
        visited = visited_indexes[i]
        if is_connected:
            if is_big(i):
                traverse_vertices_part2(i, visit_twice)

            elif not visited:
                visited_indexes[i] = True
                traverse_vertices_part2(i, visit_twice)
                visited_indexes[i] = False

            elif not visit_twice and i is not get_v_index("start"):
                traverse_vertices_part2(i, True)


def do_stuff(is_part2=False):
    global visited_indexes
    visited_indexes = get_blank_visited_indexes()

    start_index = get_v_index("start")
    visited_indexes[start_index] = True

    traverse_vertices_part2(start_index) if is_part2 else traverse_vertices(start_index)

    print(f"{'part 2' if is_part2 else 'part1'} path count: {paths_count}")


do_stuff(is_part2=True)
