################################################################################################################################
# Author: Georgi Marinov                                                                                                       #
#                                                                                                                              #
#                                                                                                                              #
# Python script for downloading the latest schedule from Varna University of Management with Selenium and urllib,              #
# removing the unnecessary schedule worksheets, passed events, and finally saving the file with openpyxl                       #
# After that the schedule is uploaded to google drive so i can easily look it up on my phone!***                               #
# Lazy, i know... :)                                                                                                           #
#                                                                                                                              #
# ***You need to have your Google API's client secret in the 'client_secrets.json' file in the same directory for this to work #
################################################################################################################################

import urllib
import os
import datetime
from selenium import webdriver
from openpyxl import load_workbook
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

def clean(filename):
    if os.path.exists(filename): 
        os.remove(filename)

def getLink():
    print "Starting Selenium with PhantomJS to get latest schedule link..."

    driver = webdriver.PhantomJS()
    #driver.set_window_size(1120, 550)
    driver.get("https://vum.bg/varna-schedule/")
    query = 'var ret; [].forEach.call(document.getElementsByTagName("a"), function (e) { if(e.innerHTML==="<strong>WINTER SEMESTER SCHEDULE 2017/2018</strong>") ret=e.href; } ); return ret;'
    result = driver.execute_script(query)
    driver.quit()
    
    print result

    return result

def downloadLink( link, name ):
    print "Downloading schedule..."
    urllib.urlretrieve(link, name)
    print "Done."
    return

def processSheet( sheet ):
    print "  Processing "+str(sheet.title)
    
    now = datetime.datetime.now()
    day = now.day
    month = now.month

    for row in sheet.rows:
        if row[0].value: 
            arr = row[0].value.split(' - ');
            if len(arr)>1 and len(arr[1].split())>1:
                #print str(row[0].row) + " " + arr[0] + " " + arr[1]
                parsed = datetime.datetime.strptime(arr[1],"%d %B")
                parsed2 =datetime.datetime.strptime(arr[0],"%d %B")

                if parsed.month==month and parsed.day>=day:
                    break
                if parsed.month!=parsed2.month and parsed2.month==month and parsed2.day<=day:
                    break
                   
        sheet.row_dimensions[row[0].row].hidden = True
    return

def processFile( name, saveName ):
    print "Loading schedule..."
    wb = load_workbook( name )
    names = wb.get_sheet_names()
    
    print names
    print "Removing uneccessary sheets"
    
    for sheet in names:
        if sheet[0]!='S':
            std = wb.get_sheet_by_name(sheet)
            wb.remove_sheet(std)

    print wb.get_sheet_names()
    
    print "Hiding passed events..."
    for sheet in wb:
        processSheet(sheet)
    
    print "Saving schedule..."
    wb.save(saveName)
    print "Saved."
    return

def uploadFile ( name ):
    print "Logging in Google Drive "
    gauth = GoogleAuth()
    gauth.LoadCredentialsFile("client_credentials.txt")

    if gauth.credentials is None:
        gauth.CommandLineAuth()
    elif gauth.access_token_expired:
        gauth.Refresh()
    else:
        gauth.Authorize()

    gauth.SaveCredentialsFile("client_credentials.txt")

    drive = GoogleDrive(gauth)
    
    print "Finding old schedule file..."
    
    file_list = drive.ListFile({'q': "title='schedule.xlsx' and trashed=false"}).GetList()
    newFile = file_list[0]
    newFile.SetContentFile(name)
    
    print "Uploading..."
    newFile.Upload()
    print "All done!"
    return

clean('raw.xlsx')
clean('schedule.xlsx')

link = getLink()
downloadLink(link,'raw.xlsx')
processFile('raw.xlsx','schedule.xlsx')
uploadFile('schedule.xlsx')
