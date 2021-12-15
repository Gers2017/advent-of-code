# Day 10: Syntax Scoring
from typing import List

debug = False

with open("test_input.txt" if debug else "input.txt") as f:
    lines = f.read().splitlines()

open_symbols = "([{<"
close_symbols = ")]}>"

illegal_symbols_map = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
}

autocomplete_symbols_map = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
}


def get_open_symbol(close_sym) -> str:
    index = close_symbols.find(close_sym)
    return "" if index == -1 else open_symbols[index]


def get_close_pair(open_sym) -> str:
    index = open_symbols.find(open_sym)
    return close_symbols[index]


class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)

    def pop(self):
        return None if self.is_empty() else self.items.pop()

    def get_last(self):
        return self.items[len(self.items) - 1] if not self.is_empty() else None


def calculate_autocomplete_score(completion_symbols):
    score = 0
    for symbol in completion_symbols:
        score = score * 5 + autocomplete_symbols_map[symbol]
    return score


def calculate_syntax_error_score(illegal_symbols: List[str]):
    syntax_error_score = 0
    for ill_sym in illegal_symbols:
        syntax_error_score += illegal_symbols_map[ill_sym]
    return syntax_error_score


def solution(is_print: bool = False):
    first_illegal_symbols = []
    autocomplete_scores = []
    for line in lines:
        stack = Stack()
        is_corrupted_line = False
        for symbol in line:
            if symbol in open_symbols:
                stack.push(symbol)
            if symbol in close_symbols:
                open_symbol = stack.pop()
                if not open_symbol == get_open_symbol(symbol):
                    print(f"We got an error {open_symbol} does not match {symbol}") if is_print else None
                    is_corrupted_line = True
                    first_illegal_symbols.append(symbol)
                    break
        if not is_corrupted_line:
            close_items = [get_close_pair(s) for s in stack.items]
            close_items.reverse()
            autocomplete_scores.append(calculate_autocomplete_score(close_items))
            print(f"{''.join(stack.items)} -- {''.join(close_items)}") if is_print else None

    syntax_error_score = calculate_syntax_error_score(first_illegal_symbols)
    sorted_scores = sorted(autocomplete_scores)
    middle_score = sorted_scores[int(len(sorted_scores) / 2)]

    return syntax_error_score, middle_score


print(f"solution: {solution()}")
