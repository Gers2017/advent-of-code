from typing import Callable, List, Tuple
from hex_map import hex_to_bin
from tools import Sequence, Packet

Case = Tuple[str, int]
Cases = List[Case]


def run_test(_cases: Cases, action: Callable[[str], int]):
    for v in _cases:
        hex_val, expected = v
        got = action(hex_val)
        if got != expected:
            print(f"Values don't match, Expeced: {expected}, Got: {got}")
        else:
            print(f"Test passed, Expeced: {expected}, Got: {got}")


def _test_part_1():
    cases = [
        ("8A004A801A8002F478", 16),
        ("620080001611562C8802118E34", 12),
        ("C0015000016115A2E0802F182340", 23),
    ]

    def sumver(hex_val: str):
        bits = hex_to_bin(hex_val)
        Packet.FromSequence(Sequence(bits))
        res = sum(Packet.versions)
        Packet.versions = []
        return res

    run_test(cases, sumver)


def _test_part2():
    cases = [
        ("C200B40A82", 3),
        ("04005AC33890", 54),
        ("880086C3E88112", 7),
        ("CE00C43D881120", 9),
        ("9C005AC2F8F0", 0),
        ("9C0141080250320F1802104A08", 1)
    ]

    def get_value(hex_val: str):
        bits = hex_to_bin(hex_val)
        p = Packet.FromSequence(Sequence(bits))
        return p.get_value()

    run_test(cases, get_value)


def _test_from_seq():
    # bits = hex_to_bin("D2FE28")  # literal: 2021
    bits = hex_to_bin("38006F45291200")  # operator: 1
    seq = Sequence(bits)
    p = Packet.FromSequence(seq)
    print(p.get_value())


# _test_part_1()
# _test_part2()
