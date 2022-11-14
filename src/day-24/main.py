from typing import Dict, Tuple

# Attributions to i_have_no_biscuits

def parse_line(line: str) -> int:
    # s = "".join([x for x in list(line) if x.isdigit() or x == "-"])
    s = line.split()[2]
    return int(s)


def proc(params, z: int, w: int):
    (a, b, c) = params
    if ((z % 26) + b != w):
        return (z // a) * 26 + (w + c)
    else:
        return z // a


def parse_input():
    with open("input.txt") as f:
        lines = f.readlines()
    a_idx = 4
    b_idx = 5
    c_idx = 15

    parameters = []

    for i in range(0, 14):
        a = parse_line(lines[a_idx + 18 * i])
        b = parse_line(lines[b_idx + 18 * i])
        c = parse_line(lines[c_idx + 18 * i])
        parameters.append((a, b, c))
    return parameters


parameters = parse_input()

zs: Dict[int, Tuple[int, int]] = {0: (0, 0)}
for i, param in enumerate(parameters):
    new_zs = {}
    for z, inp in zs.items():
        if z >= 26 ** (len(parameters) - i):
            continue

        for w in range(1, 10):
            new_z = proc(param, z, w)

            if param[0] == 1 or (param[0] == 26 and new_z < z):
                new_low, new_high = inp[0]*10+w, inp[1]*10+w
                if new_z not in new_zs:
                    new_zs[new_z] = (new_low, new_high)
                else:
                    old_low, old_high = new_zs[new_z]
                    new_zs[new_z] = (
                        min(old_low, new_low),
                        max(old_high, new_high)
                    )

    zs = new_zs

print("Best valid values:", zs[0])
