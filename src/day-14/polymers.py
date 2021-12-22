from Rule import Rule
from Polymer import Polymer

DEBUG = True
filenmame = "input_test.txt" if DEBUG else "input.txt"
with open(filenmame) as f:
    data = f.read()

lines = data.strip().split("\n")
template = lines[0]
rules_input = lines[2:] # skip first two lines
rules = [Rule(rule) for rule in rules_input]

def part1(verbose=False):
  days = 10
  polymer = Polymer(template, rules)
  
  for i in range(days):
    print("-*-" * 10) if verbose else None
    polymer.pair_insertion()
    polymer.print_pattern_count(True) if verbose else None
    print("-*-" * 10) if verbose else None
  
  polymer.print_char_count()

  max_count = max(polymer.char_count.values())
  # get the min char_count value greater than zero
  min_count = min([c for c in polymer.char_count.values() if c > 0])

  result = max_count - min_count
  print(f"Part 1: {result}")

part1()
