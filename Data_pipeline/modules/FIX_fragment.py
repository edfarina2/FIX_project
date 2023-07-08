import os
from datetime import datetime
import logging

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)

class FIX_fragment:


	def __init__(self, string=None):

		if (string==None):
			# Fragment has some mandatory fields 

			self.rec_datetime =   datetime.now()
			self.rec_trad_system = ""

			self.BeginString = 4.2
			self.BodyLength = 1
			self.MsgType = 35
			self.Checksum = 10

			self.ListAttributes = {}


			self.listCompulKey = ["8", "9", "35", "10"]
			# And a list of key-value pair

		else:

			self.listCompulKey = ["8", "9", "35", "10"]

			self.fix_message = string

			fix_attr = self.fix_message.split("|")

			key_val_temp_stor = {}


			for att in fix_attr[:-1]:
				key, val = att.split("=")

				key_val_temp_stor[key] = val

			for mand_att in self.listCompulKey:
				if (mand_att not in key_val_temp_stor):
					raise ValueError('A mandatory key ({}) for FIX fragment {} is missing'. format(mand_att, string))

			self.BeginString = key_val_temp_stor["8"].split("FIX.")[1]
			self.BodyLength = key_val_temp_stor["9"]
			self.MsgType = key_val_temp_stor["35"]
			self.Checksum = key_val_temp_stor["10"]

			del key_val_temp_stor["8"]
			del key_val_temp_stor["9"]
			del key_val_temp_stor["35"]
			del key_val_temp_stor["10"]

			self.ListAttributes = key_val_temp_stor


	def Load_from_TradString(self, string):

		self.listCompulKey = ["8", "9", "35", "10"]

		mess_metadata = string.split(" (INFO) : ")[0]

		self.fix_message = string.split(" (INFO) : ")[1]

		self.rec_datetime = mess_metadata.split("[")[0]
		self.rec_trad_system = mess_metadata.split("[")[1].split("]")[0].replace("[","").replace("]","")

		fix_attr = self.fix_message.split("|")

		key_val_temp_stor = {}


		for att in fix_attr[:-1]:
			key, val = att.split("=")

			key_val_temp_stor[key] = val

		for mand_att in self.listCompulKey:
			if (mand_att not in key_val_temp_stor):
				raise ValueError('A mandatory key ({}) for FIX fragment {} is missing'. format(mand_att, string))

		self.BeginString = key_val_temp_stor["8"].split("FIX.")[1]
		self.BodyLength = key_val_temp_stor["9"]
		self.MsgType = key_val_temp_stor["35"]
		self.Checksum = key_val_temp_stor["10"]

		del key_val_temp_stor["8"]
		del key_val_temp_stor["9"]
		del key_val_temp_stor["35"]
		del key_val_temp_stor["10"]

		self.ListAttributes = key_val_temp_stor


	def Check_FIX_frag(self):

		# Checksum

		string_for_checksum  = self.fix_message.split("10=")[0]
		

		def getval(c):
			val = ord(c)
			if val==124:
				return 1
			else:
				return val

		tot_val = sum([getval(c) for c in string_for_checksum])
		if (tot_val%256 != int(self.Checksum) ):
			logging.warning('Checksum control has failed')
		else:
			logging.info('Checksum control succeded')


	def Check_FIX_frag_length(self):

		# Checksum


		string_for_checksum = "-".join(self.fix_message.split("|", 2)[2:])
		string_for_checksum = string_for_checksum.split("10=")[0]

		if (len(string_for_checksum) != int(self.BodyLength) ):
			logging.warning('Length control has failed')
		else:
			logging.info('Length control succeded')


	