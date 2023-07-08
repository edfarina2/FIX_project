import os
from datetime import datetime
import logging

import sys
import pymssql
from . import FIX_fragment
import time

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)


class DB_interface:

	def __init__(self):

		self.cur = None
		self.conn = None

	def Connect(self):

		try:
		    self.conn = pymssql.connect(
		        user="sa",
		        password="<YourStrong@Passw0rd>",
		        server="localhost",
		        database="FIX_DB"

		    )
		except pymssql.Error as e:
		    logging.error(f"Error connecting to DB Platform: {e}")
		    
		self.cur = self.conn.cursor() 



	def AddFIXToDB(self, FIX_frag):
		#insert information 
		#start = time.time()
		try: 	
			print(FIX_frag.rec_datetime)

			print("INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length, TradSyst) VALUES ({}, {}, {}, {}, {}, {});".format(FIX_frag.rec_datetime.split("_")[0], FIX_frag.BeginString, FIX_frag.MsgType, FIX_frag.Checksum, FIX_frag.BodyLength,  FIX_frag.rec_trad_system))

			self.cur.execute("INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length, TradSyst) VALUES (%s, %d, %d, %d, %d, %s)", (FIX_frag.rec_datetime.split("_")[0], FIX_frag.BeginString, FIX_frag.MsgType, FIX_frag.Checksum, FIX_frag.BodyLength, FIX_frag.rec_trad_system)) 
		except pymssql.Error as e: 
		    logging.error(f"Error: {e}")


		self.conn.commit() 


		val_id = self.cur.lastrowid
		print(val_id)
		print("jsvius")

		try:
			for key in FIX_frag.ListAttributes:
				print("INSERT INTO Attribute (FIX_ID, Attr, Val)  VALUES( {}, {}, {});".format(val_id, key, FIX_frag.ListAttributes[key]))

				self.cur.execute("INSERT INTO Attribute (FIX_ID, Attr, Val)  VALUES( %d, %d, %s)", (val_id, key, FIX_frag.ListAttributes[key])) 

		except pymssql.Error as e: 
		    logging.error(f"Error: {e}")

		self.conn.commit() 

		#stop = time.time()

		#print(stop-start)


