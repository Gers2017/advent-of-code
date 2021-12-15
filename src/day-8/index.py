from typing import List, Dict, Union, Tuple

# get input from text file called test_input.txt using the open() function
with open('input.txt') as f:
    lines = f.read().split("\n")


def part_one(input_lines: List[str]) -> int:
    outputs: List[List[str]] = list(map(lambda line: line.split(" | ")[1].split(" "), input_lines))
    # get the output from the outputs lits and flatten it into items
    items = [item for output in outputs for item in output]
    # filter the items if the lenght of the item is on [2, 3, 4, 7]
    filtered_items = list(filter(lambda item: len(item) in [2, 3, 4, 7], items))
    return len(filtered_items)


def part_2(input_lines: List[str]):
    note_entries: List[Tuple[List[str], List[str]]] = list(
        map(lambda line: (line.split(" | ")[0].split(" "), line.split(" | ")[1].split(" ")), input_lines))
    entry_outputs = []
    for note_entry in note_entries:
        inputs = note_entry[0]
        outputs = note_entry[1]
        digit_map, signal_map = get_digit_map_from_inputs(inputs)
        output_result = ""

        print(f"-- -- {signal_map} -- --, outputs: {outputs}")
        for output in outputs:
            sorted_output = ''.join(sorted(output))
            if sorted_output in signal_map.keys():
                output_result += str(signal_map[sorted_output])

        entry_outputs.append(output_result)
    print(f"total sum of outputs: {sum(map(int, entry_outputs))}")


def get_digit_map_from_inputs(inputs: List[str]):
    digits_map: Dict[int, str] = {}
    for _input in inputs:
        match len(_input):
            case 2:
                digits_map[1] = _input
            case 3:
                digits_map[7] = _input
            case 4:
                digits_map[4] = _input
            case 7:
                digits_map[8] = _input

    sixs = list(filter(lambda item: len(item) == 6, inputs))
    fives = list(filter(lambda item: len(item) == 5, inputs))

    # print(f"-- -- sixs {sixs}, 4: {digits_map[4]}, 7: {digits_map[7]}")
    nine = list(filter(lambda item: get_missing_count(item, digits_map[7] + digits_map[4]) == 1, sixs))[0]
    digits_map[9] = nine

    # print(f"-- -- fives {fives}, 9: {nine}")
    # look for two
    for five_item in fives:
        missing_from_nine, exceed_from_nine = get_diff_signal(five_item, nine)
        if missing_from_nine == 1 and exceed_from_nine == 2:
            digits_map[2] = five_item
            # print(f">>{five_item} is the item to be two")

    # look for five
    for five_item in fives:
        missing_from_two, exceed_from_two = get_diff_signal(five_item, digits_map[2])
        if missing_from_two == 2 and exceed_from_two == 2:
            # print(f">>{five_item} is the item to be five")
            digits_map[5] = five_item
    # look for three
    three = list(filter(lambda item: item not in [digits_map[2], digits_map[5]], fives))[0]
    digits_map[3] = three
    # print(f">>{three} is the item to be three")

    # look for six
    for six_item in sixs:
        missing_from_five, exceed_from_five = get_diff_signal(six_item, digits_map[5])
        if missing_from_five == 1 and exceed_from_five == 0 and six_item != digits_map[9]:
            # print(f">>{six_item} is the item to be six")
            digits_map[6] = six_item
    zero = list(filter(lambda item: item not in [digits_map[6], digits_map[9]], sixs))[0]
    digits_map[0] = zero
    # print(f">>{zero} is the item to be zero")

    # print signal_digits dict with key and value
    signal_map: Dict[str, int] = {}
    for key, value in digits_map.items():
        # print(f"{key}: {value}")
        # sort the value alphabetically
        sorted_value = ''.join(sorted(value))
        signal_map[sorted_value] = key

    return digits_map, signal_map


def get_missing_count(uncomplete_value: str, complete_value: str):
    return len(get_missing_values(uncomplete_value, complete_value))


def get_missing_values(uncomplete_value: str, complete_value: str):
    return list(filter(lambda char: char not in complete_value, uncomplete_value))


def get_diff_signal(unique_signal: str, found_signal: str):
    missing = 0
    exeeding = 0
    found_signal_set = list(set(found_signal))

    for found_char in found_signal_set:
        if found_char not in unique_signal:
            exeeding += 1
    for sig_char in unique_signal:
        if sig_char not in found_signal_set:
            missing += 1

    return missing, exeeding


part_2(lines)
