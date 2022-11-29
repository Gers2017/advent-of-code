from typing import Dict, List, Tuple
import math

with open("input.txt", "r") as file:
  Positions = list(map(int, file.read().split(",")))

hashmap = {}
def getNonConstantFuel(targetPos, currentPos):
    pos = min(targetPos, currentPos)
    target = max(targetPos, currentPos)
    fuel = 0
    if hashmap.get(f"{pos},{target}"):
      return hashmap[f"{pos},{target}"]
    
    for i in range(1, (target - pos) + 1):
      fuel += i
    
    hashmap[f"{pos},{target}"] = fuel
    return fuel
  

def getFuelOnPosition(targetPos: int, positions: List[int], isConstant: bool) -> int:
  totalFuel = 0
  for pos in positions:
    fuel = 0
    if isConstant:
      fuel = abs(targetPos - pos)
    else:
      fuel = getNonConstantFuel(targetPos, pos)
    
    totalFuel += fuel # add the result
  return totalFuel # total fuel


RecordPosFuel = dict()
for position in range(min(Positions), max(Positions)):
  RecordPosFuel[position] = getFuelOnPosition(position, Positions, False)


def getLowestPosFuel(recordPosFuel: Dict[int, int]) -> Tuple[int, int]:
  lowestPos = -1
  lowestFuel = math.inf

  for pos in recordPosFuel:
    fuel = recordPosFuel[pos]
    if fuel < lowestFuel:
      lowestFuel = fuel
      lowestPos = pos
  
  return ( lowestPos, lowestFuel )


targetPos, targetFuel = getLowestPosFuel(RecordPosFuel)
print(f"the cheapest outcome requires {targetFuel} of fuel moveing to position {targetPos}")
