import glob
import errno
import csv
import mysql.connector
from mysql.connector import Error
from mysql.connector import errorcode

path = '/Users/shonhittrehan/Downloads/*.csv' # @ashish Reminder : Folder address needs to be changed 
# path = '/Users/shonhittrehan/Downloads/Users-Steps-3.csv'
files = glob.glob(path)

fields = [] 
rows = [] 

for name in files:
    try:
        print("adding file" + name)
        with open(name,'r') as csvfile:
          csvreader = csv.reader(csvfile)
          fields=next(csvreader)
          for row in csvreader:
            rows.append(row)
    except IOError as exc:
        if exc.errno != errno.EISDIR:
            raise Exception("Sorry, Could not read input")

users = []

usersdata = []


for row in rows : 
  if len(row) == 5 : 
    name = row[1]
    id = int(row[0])
    date = int(row[2])
    cal = int(row[3])
    steps = int(row[4])
    userAdd = [id,name]
    if not(userAdd in users) : 
      users.append(userAdd)

    usdataAdd = [id,date, cal,steps]
    usersdata.append(usdataAdd)




try:
   print ("Record insertion strted into python_users table")
   connection = mysql.connector.connect(host='localhost',database='shonhitTesting',user='root',password='')#,auth_plugin='mysql_native_password')

   #sql_insert_query = """ INSERT INTO `checkFiles` (`randomVal`) VALUES (121)"""
   sql_insert_query = " INSERT INTO checkFiles (randomVal) VALUES (121) "

   cursor = connection.cursor()
   for rows in users:
      sqlQ = "INSERT INTO users(userid , name ) VALUES (%d,%s)"%(rows[0],rows[1])
      result  = cursor.execute(sql_insert_query)

   for rows in usersdata : 
       sqlQ = "INSERT INTO users(userid , date, steps, calories ) VALUES (%d,%d, %d, %d)"%(rows[0],rows[1],rows[2],rows[3])
   
   connection.commit()
   print ("Record inserted successfully into users and usersdata table")

except mysql.connector.Error as error :
    connection.rollback() #rollback if any exception occured
    print("Failed inserting record into DB {}".format(error))

finally:
    #closing database connection.
    if(connection.is_connected()):
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
