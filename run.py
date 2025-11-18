import os
import sys
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cmd = [
    sys.executable,  
    os.path.join(BASE_DIR, 'manage.py'),
    'runserver'
]
subprocess.run(cmd)  