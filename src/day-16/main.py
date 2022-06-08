from hex_map import hex_to_bin
from tools import Sequence, Packet

'''
- make an iterator for the sequence of bits
- make a function that takes a sequence and parses it into a Packet
- implement Literal and Operator packets
'''


def get_input():
    with open("input.txt") as f:
        text = f.read()
        return text.strip()


def part_1():
    bits = hex_to_bin(get_input())
    seq = Sequence(bits)
    Packet.FromSequence(seq)
    print("Total of versions", sum(Packet.versions))


def part_2():
    bits = hex_to_bin(get_input())
    seq = Sequence(bits)
    p = Packet.FromSequence(seq)
    print("Value:", p.get_value())
