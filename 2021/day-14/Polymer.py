class Polymer:
  def __init__(self, template, rules):
    self.template = template
    self.pairs_count = {}
    self.rules_dict = {}
    self.char_count = {}

    for ch in self.template:
      self.add_char_count(ch)
    
    for rule in rules:
      self.rules_dict[rule.pattern] = rule.result
    
    self.initialize_pairs_count()

  def rule_exists(self, pattern):
    return self.rules_dict.get(pattern) is not None



  def add_char_count(self, ch, amount=1):
    if self.char_count.get(ch) is not None:
      self.char_count[ch] += amount
    else:
      self.char_count[ch] = amount


  def get_count(self, pattern) -> int:
    return self.pairs_count.get(pattern, 0)


  def add_pair_count(self, pattern, amount=1):
    if self.pairs_count.get(pattern) is not None:
      self.pairs_count[pattern] += amount
    else:
      self.pairs_count[pattern] = amount


  def initialize_pairs_count(self):
    length = len(self.template)
    for i in range(length):
      if  i + 1 < length:
        pair = self.template[i : i + 2]
        self.add_pair_count(pair)
  

  def print_char_count(self):
    for ch, count in self.char_count.items():
      print(f"{ch}:{count}")


  def print_pattern_count(self, non_zero_only=False):
    for pattern, count in self.pairs_count.items():
      if non_zero_only and count == 0:
        continue
      print(f"{pattern} -> {count}")
  

  def pair_insertion(self):
    # make a copy of the pattern_count
    prev_pairs_count = self.pairs_count.copy()

    for rl_pattern, rl_result in self.rules_dict.items():
      # consult the prev_pairs_count, get the count of the rule pattern
      pair_dict_ctn = prev_pairs_count.get(rl_pattern, 0)

      if pair_dict_ctn == 0:
        continue

      self.add_char_count(rl_result, pair_dict_ctn)
      # modify the original pairs_count
      self.pairs_count[rl_pattern] -= pair_dict_ctn

      pair_before = rl_pattern[0] + rl_result
      pair_after = rl_result + rl_pattern[1]

      self.add_pair_count(pair_before, pair_dict_ctn)
      self.add_pair_count(pair_after, pair_dict_ctn)