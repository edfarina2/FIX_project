from modules import FIX_fragment
from modules import DB_interface

import sys
import time


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


for i in range(0,100):

	delay = 0
	a = list_frag[0]



	for i in range(0,100):

		for frag in list_frag:

			DB.AddFIXToDB(frag)

	start = time.time()

	DB.AddFIXToDB(a)

	end = time.time()

	print(end-start)


#	print(f"for 1o iteraz - delay = {delay/99999}")
