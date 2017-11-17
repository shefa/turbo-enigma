################################################################################################################################
# Author: Georgi Marinov                                                                                                       #
#                                                                                                                              #
#                                                                                                                              #
# Python script for downloading the images for ocr testing from my google drive.                                               #
# Images are property of Taxback International                                                                                 #
#                                                                                                                              #
# Ocr testing is done first by preprocessing the images with textcleaner, deskewing scripts and OSD filters.                   #
#                                                                                                                              #
# ***You need to have your Google API's client secret in the 'client_secrets.json' file in the same directory for this to work #
################################################################################################################################

import os
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

def clean(filename):
    if os.path.exists(filename): 
        os.remove(filename)


def createFolder(directory):
    if not os.path.exists(directory):
            os.makedirs(directory)

def getFiles( drive, query ):
    file_list = drive.ListFile({'q': query}).GetList()
    for file1 in file_list:
        print('title: %s, id: %s' % (file1['title'], file1['id']))

    return file_list

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
    
    print "Finding ocr files..."
    
    ocr_folder = getFiles(drive, "title='OCR' and trashed=false")[0]
    
    subfolders = getFiles(drive,"'"+ocr_folder['id']+"' in parents and trashed=false")
    
    for folder in subfolders:
        createFolder(folder['title'])
        files = getFiles(drive, "'"+folder['id']+"' in parents and trashed=false")
        for tmpFile in files:
            tmpFile = drive.CreateFile({'id':tmpFile['id']})
            tmpFile.GetContentFile(folder['title']+"/"+tmpFile['title'])


    print "All done!"
    return

uploadFile('schedule.xlsx')
