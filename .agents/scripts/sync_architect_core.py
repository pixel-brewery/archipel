#!/usr/bin/env python3
"""Validate Archipel's versioned Architecture dependency without mutating peers."""

from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import sys


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Read-only validation (the default).")
    parser.parse_args()
    root = Path(__file__).resolve().parents[2]
    checker = root / ".agents/skills/architecture/scripts/check_inheritance.py"
    if not checker.is_file():
        print("Missing Architecture base. Restore the skills-lock.json dependency with the Skills CLI.", file=sys.stderr)
        return 1
    return subprocess.run(
        [sys.executable, str(checker), "--root", str(root), "--derived", "archipel-architect"],
        cwd=root,
        check=False,
    ).returncode


if __name__ == "__main__":
    raise SystemExit(main())
