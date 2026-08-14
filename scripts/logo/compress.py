"""Minimal SVG path writer: relative commands, implicit repeats, and the
separator dropped wherever the grammar can still tell two numbers apart.
Coordinates accumulate against the *rounded* pen position, so error never
drifts along a contour."""

import re

TOK = re.compile(r'[MLCZ]|-?\d+\.?\d*(?:[eE][-+]?\d+)?')


def parse(d):
    """Absolute M/L/C/Z path -> [(cmd, [(x, y), ...]), ...]."""
    toks = TOK.findall(d)
    out, i = [], 0
    while i < len(toks):
        t = toks[i]
        if t in 'MLC':
            n = {'M': 1, 'L': 1, 'C': 3}[t]
            out.append((t, [(float(toks[i + 1 + 2 * k]), float(toks[i + 2 + 2 * k]))
                            for k in range(n)]))
            i += 1 + 2 * n
        elif t == 'Z':
            out.append(('Z', []))
            i += 1
        else:
            i += 1
    return out


def _num(v, prec):
    s = f'{v:.{prec}f}'
    if '.' in s:
        s = s.rstrip('0').rstrip('.')
    if s in ('', '-0', '-'):
        return '0'
    if s.startswith('0.'):
        return s[1:]
    if s.startswith('-0.'):
        return '-' + s[2:]
    return s


class _Writer:
    """Appends tokens, inserting a space only where one is actually needed."""

    def __init__(self):
        self.parts = []
        self.prev = ''      # last number written, '' after a command letter

    def cmd(self, letter):
        self.parts.append(letter)
        self.prev = ''

    def num(self, s):
        # After a letter, never. Before a sign, never. Before a bare `.5`, only
        # if the previous number already spent its decimal point — otherwise
        # `5` and `.3` would run together and read as `5.3`.
        if self.prev and not (s[0] == '-' or (s[0] == '.' and '.' in self.prev)):
            self.parts.append(' ')
        self.parts.append(s)
        self.prev = s

    def __str__(self):
        return ''.join(self.parts)


def compress(d, prec=1):
    q = 10 ** prec
    w = _Writer()
    pen = start = (0.0, 0.0)
    last = None

    for cmd, pts in parse(d):
        if cmd == 'Z':
            w.cmd('z')
            pen, last = start, None
            continue

        # Every pair in one command is relative to the point the command
        # started from — control points do not chain off each other.
        deltas = []
        for (x, y) in pts:
            deltas += [round((x - pen[0]) * q) / q, round((y - pen[1]) * q) / q]
        p = (pen[0] + deltas[-2], pen[1] + deltas[-1])

        letter = {'M': 'm', 'L': 'l', 'C': 'c'}[cmd]
        if letter != last:
            w.cmd(letter)
            # A moveto's extra coordinate pairs are implicit linetos.
            last = 'l' if letter == 'm' else letter
        for v in deltas:
            w.num(_num(v, prec))

        pen = p
        if cmd == 'M':
            start = p

    return str(w)
