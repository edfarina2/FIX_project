import os
from datetime import datetime
import logging

import sys
import mariadb
from . import FIX_fragment
import time

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)


class DB_interface:

	def __init__(self):

		self.cur = None
		self.conn = None

	def Connect(self):
		# Connect to MariaDB Platform
		try:
		    self.conn = mariadb.connect(
		        user="FIX_pipeline",
		        password="password",
		        host="localhost",
		        port=3306,
		        database="FIX_DB"

		    )
		except mariadb.Error as e:
		    logging.error(f"Error connecting to MariaDB Platform: {e}")
		    
		self.cur = self.conn.cursor() 



	def AddFIXToDB(self, FIX_frag):
		#insert information 
		#start = time.time()
		try: 	

			print("INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length) VALUES ({}, {}, {}, {}, {});".format(FIX_frag.rec_datetime, FIX_frag.BeginString, FIX_frag.MsgType, FIX_frag.Checksum, FIX_frag.BodyLength))

			self.cur.execute("INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length) VALUES (?, ?, ?, ?, ?)", (FIX_frag.rec_datetime, FIX_frag.BeginString, FIX_frag.MsgType, FIX_frag.Checksum, FIX_frag.BodyLength)) 
		except mariadb.Error as e: 
		    logging.error(f"Error: {e}")


		self.conn.commit() 


		val_id = self.cur.lastrowid

		try:
			for key in FIX_frag.ListAttributes:
				print("INSERT INTO Attribute (FIX_ID, Attr, Val)  VALUES( {}, {}, {});".format(val_id, key, FIX_frag.ListAttributes[key]))
				self.cur.execute("INSERT INTO Attribute (FIX_ID, Attr, Val)  VALUES( ?, ?, ?)", (val_id, key, FIX_frag.ListAttributes[key])) 

		except mariadb.Error as e: 
		    logging.error(f"Error: {e}")

		self.conn.commit() 

		#stop = time.time()

		#print(stop-start)


