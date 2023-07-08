import os
import random
import time, datetime
import sys
from optparse import OptionParser
import getopt


MINTIME = datetime.datetime(2010,8,6,8,14,59)
MAXTIME = datetime.datetime(2023,6,9,8,14,59)

mintime_ts = int(time.mktime(MINTIME.timetuple()))
maxtime_ts = int(time.mktime(MAXTIME.timetuple()))

version = [4.2, 4.4]


def random_date():
	random_ts = random.randint(mintime_ts, maxtime_ts)
	RANDOMTIME = datetime.datetime.fromtimestamp(random_ts)
	return RANDOMTIME

def Generate_FIX(var=""):

	timest = (random_date())

	ver_fix = version[0] if random.random()<0.5 else version[1]

	type_fix = random.choice(["A","F","8"])

	length = int(random.random()*1000)
	checksum = int(random.random()*1000)

	attr = {}

	trad_sys = random.choice(["SystemB","SystemA","SystemC"])


	for i in range(0, int((random.random()*10)+10)):
		attr[int(random.random()*400)]= int(random.random()*1000)

	string = """INSERT INTO Fix_messages (Timestamp, Version, Type, Checksum, Length, TradSyst) VALUES ('{}',{} ,'{}', {}, {}, '{}');
SET @ide = (SELECT SCOPE_IDENTITY()); """.format(timest, ver_fix, type_fix, checksum, length, trad_sys )
	
	if (len(attr)>0):
		string +="INSERT INTO Attribute (FIX_ID, Attr, Val)  VALUES"
		for key in attr:

			string += "( @ide, {}, '{}'), ".format(key, attr[key])
		string = string.rsplit(',', 1)[0]
		string += "; \n"

	
	return (string)


def Generate_FIX_to_file(number):

	input = open("file.sql", "w")
	
	input.write("USE FIX_DB;\n")
	input.write("BEGIN TRANSACTION;\n")
	input.write("DECLARE @ide INT;")


	for i in range(0,int(number)):
		if ((i % 10000)==0): 
			input.write("COMMIT;")
			input.write("BEGIN TRANSACTION;\n")
		input.write(Generate_FIX())
	input.write("COMMIT;")

	input.close()

if __name__ == '__main__':


	try:
 		opts, args = getopt.getopt(sys.argv[1:],"ts:")
	except getopt.GetoptError as err:
     # print (str(err))
 		sys.exit(2)
	for opt, arg in opts:
 		if opt == '-t':
  			print(Generate_FIX(sys.argv[1:]))
 		if opt == '-s':
  			(Generate_FIX_to_file(arg))
