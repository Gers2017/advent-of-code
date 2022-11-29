class Rule:
    def __init__(self, rule):
        self.rule = rule
        pattern, result = rule.split(" -> ")
        self.pattern = pattern
        self.result = result