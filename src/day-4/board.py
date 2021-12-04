from typing import (
  Dict,
  List,
  Tuple
)

class Board:
  def __init__(self, name: str, board: List[List[int]] ):
      self.board = board
      self.name = name
      self.score = 0
      self.columns = self._gen_columns()
      self.rows = [row for row in board]
      self.marked_values : List[int] = []
      self.winner_values : List[int] = []

  def _gen_columns(self) -> List[List[int]]:
    cols_dict : Dict[str, List[int]] = {  }
    
    for b in self.board:
      for i in range(len(b)):
        key = str(i)
        item = b[i]
        if cols_dict.get(key) != None:
          cols_dict[key].append(item)
        else:
          cols_dict[key] = [item]
    return cols_dict.values()

  # values are unique and random just like you
  def is_winner(self, value: int) -> Tuple[bool, List[int], List[int]]:
    
    for row in self.rows:
      if value in row and not value in self.marked_values : self.marked_values.append(value)
      winner = does_list_overlap(row, self.marked_values)
      if winner: 
        self.winner_values = row
        self.calculate_score(value)
        return (True, row, self.marked_values)

    for col in self.columns:

      if value in col and not value in self.marked_values: self.marked_values.append(value)
      winner = does_list_overlap(col, self.marked_values)
      if winner:
        self.winner_values = col
        self.calculate_score(value)
        return (True, col, self.marked_values)
    
    return (False, [], [])
  
  def get_unmarked_values(self):
    ls : List[int] = []
    for x in self.board:
      for y in x:
        ls.append(y)
    return list(filter(lambda x: not(x in self.marked_values), ls ))

  def calculate_score(self, value: int):
    self.score = sum(self.get_unmarked_values()) * value

def does_list_overlap(ls: List[int], ls2: List[int]):
  for item in ls:
      if item not in ls2:
          return False
  return True
