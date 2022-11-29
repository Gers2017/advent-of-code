from functools import reduce
from typing import List, Iterator, Callable


def hex2bin(h: str):
    return bin(int(h, 16))[2:]


def bin2hex(b: str) -> str:
    return hex(bin2int(b))


def bin2int(b: str) -> int:
    return int(b, 2)


class Sequence():
    index: int
    max: int
    str_iter: Iterator[str]

    def __init__(self, s: str) -> None:
        self.index = 0
        self.max = len(s)
        self.str_iter = iter(s)

    def __iter__(self):
        self.str_iter.__iter__()

    def __next__(self):
        self.index += 1
        return self.str_iter.__next__()

    def has_more(self):
        return self.index < self.max

    def get_next(self, n: int = 1) -> str:
        return "".join([self.__next__() for _ in range(n)])

    def get_next_int(self, n: int = 1) -> int:
        return bin2int(self.get_next(n))

    def get_next_until(self, n: int, predicate: Callable[[str], bool]) -> List[str]:
        group = []
        while True:
            item = self.get_next(n)
            group.append(item)
            if predicate(item):
                return group

    def get_next_as_seq(self, n) -> "Sequence":
        return Sequence(self.get_next(n))

    def to_str(self):
        return "".join(self.str_iter)

    def __str__(self) -> str:
        return self.to_str()


class Packet:
    id: int
    version: int
    value: int
    versions = []

    def __init__(self, version: int, id: int, value: int = 0) -> None:
        self.version = version
        self.id = id
        self.value = value
        Packet.versions.append(version)

    def get_value(self) -> int:
        return self.value

    def __str__(self):
        return f"v {self.version}, id {self.id}, {self.get_value()}"

    @staticmethod
    def FromSequence(seq: Sequence):
        ver = seq.get_next_int(3)
        id = seq.get_next_int(3)

        if id == 4:
            return LiteralPacket(ver, id, seq)
        else:
            return OperatorPacket(ver, id, seq)


class LiteralPacket(Packet):
    def __init__(self, version: int, id: int, seq: Sequence) -> None:
        super().__init__(version, id)
        group = seq.get_next_until(5, lambda x: x.startswith("0"))
        group = [s[1:] for s in group]
        self.value = bin2int("".join(group))


class OperatorPacket(Packet):
    subpackets: List[Packet]

    def __init__(self, version: int, id: int, seq: Sequence) -> None:
        super().__init__(version, id)

        len_id = seq.get_next()

        if len_id == "0":
            # print(f"I: {len_id}, len {length}")
            # iterate over the subsequence of "length x" and get subpackets
            length = seq.get_next_int(15)
            s2 = Sequence(seq.get_next(length))
            subpackets = []

            while s2.has_more():
                p = Packet.FromSequence(s2)
                subpackets.append(p)

            self.subpackets = subpackets
            # sync sequences
            seq = s2
        else:
            # print(f"I: {len_id}, packets {number_of_packets}")
            # for i in number_of_packets, map to packet
            packets_count = seq.get_next_int(11)
            subpackets = [Packet.FromSequence(seq)
                          for _ in range(packets_count)]
            self.subpackets = subpackets

    def get_value(self) -> int:
        if self.id == 4:
            return self.value

        values = [x.get_value() for x in self.subpackets]
        match self.id:
            case 0:  # sum packets values
                return sum(values)
            case 1:  # multiply packet values
                def product(ac, v): return ac * v
                return reduce(product, values, 1)
            case 2:  # min value from packets
                return min(values)
            case 3:  # max value from packets
                return max(values)
            case 5:  # greater than - packet[0] > packet[1]
                return int(values[0] > values[1])
            case 6:  # less than - packet[0] < packet[1]
                return int(values[0] < values[1])
            case 7:  # equal to - packet[0] == packet[1]
                return int(values[0] == values[1])
            case _:
                print(f"Invalid packet id {id}")
                return -1
