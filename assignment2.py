################################################################################################################################
# Author: Georgi Marinov                                                                                                       #
#                                                                                                                              #
# Python script for measuring the performance data of wikipedia page with the help of Selenium webdriver.                      #
################################################################################################################################

import json
import csv
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

chrome_options = Options()
chrome_options.add_argument("--no-sandbox")

def getMetrics():
    print "Getting performance metrics..."
    driver = webdriver.Chrome(chrome_options=chrome_options)
    driver.get("https://en.wikipedia.org/wiki/Software_metric")
    # very beautiful query, dont you think?
    query = 'return window.performance.getEntries().reduce((r,i)=>{r[i.name]=i.duration; return r;},{});'
    #also 'window.performance.getEntries().map(x=>[x.name,x.duration]);'
    result = driver.execute_script(query)
    driver.quit()
    return result

#get metrics 10 times, sum the durations
data = getMetrics()
for x in range(9):
    newData = getMetrics()
    for y in newData:
        if y in data:
            data[y]+=newData[y]

#average them
for x in data: data[x]/=10

#format data and write a pretty json file
jsonData=[ {'name':x,'duration':data[x]} for x in data]
with open('data.json', 'w') as outfile:
    json.dump(data, outfile, indent=4, sort_keys=True)

#format data and write csv file with headers
f = csv.writer(open("performance.csv","wb+"))
f. writerow(["Name","Duration"])
for x in data:
    f.writerow([x,data[x]])