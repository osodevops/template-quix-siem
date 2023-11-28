import ctypes


class GoDetectorInterface:
    def __init__(self):
        self.lib = ctypes.CDLL('./detector.so')
        self.lib.findMatch.argtypes = [ctypes.c_char_p]
        self.lib.findMatch.restype = ctypes.c_char_p
        self.lib.updateSigmaRule.argtypes = [ctypes.c_char_p]
        self.lib.updateSigmaRule.restype = ctypes.c_bool
        self.lib.removeSigmaRule.argtypes = [ctypes.c_char_p]
        self.lib.removeSigmaRule.restype = ctypes.c_bool
        self.lib.isValidSigmaRule.argtypes = [ctypes.c_char_p]
        self.lib.isValidSigmaRule.restype = ctypes.c_bool

    def update_rule(self, rule):
        return self.lib.updateSigmaRule(ctypes.c_char_p(rule.encode('utf-8')))

    def remove_rule(self, rule_id):
        return self.lib.removeSigmaRule(ctypes.c_char_p(rule_id.encode('utf-8')))

    def is_valid_sigma_rule(self, rule):
        return self.lib.isValidSigmaRule(ctypes.c_char_p(rule.encode('utf-8')))

    def find_match(self, log_entry):
        return self.lib.findMatch(ctypes.c_char_p(log_entry)).decode('utf-8')
