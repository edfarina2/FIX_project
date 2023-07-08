from modules import FIX_fragment
from modules import DB_interface_MS as DB_interface 

import sys

# Using readlines()
file = open('FIX_logs.txt', 'r')
lines = file.readlines()

list_frag = []

for line in lines:
	fix_frag = FIX_fragment.FIX_fragment()
	fix_frag.Load_from_TradString(line)

	list_frag.append(fix_frag)


DB = DB_interface.DB_interface()
DB.Connect()

for frag in list_frag:
	DB.AddFIXToDB(frag)