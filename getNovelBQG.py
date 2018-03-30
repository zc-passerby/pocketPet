#! /usr/bin/env python
#-*- coding=utf-8 -*-

import sys, requests, time
import urllib, urllib2, re
from bs4 import BeautifulSoup

websiteHome = 'http://www.ymoxuan.com'
websiteSearchUrl = 'http://www.ymoxuan.com/search.htm'

f = None
startPage = ''
#NovelList = []

def parseChapterPage(pageUrl):
    #print pageUrl
    global startPage
    startPage = pageUrl
    chapterPage = requests.get(pageUrl)
    chapterSoup = BeautifulSoup(chapterPage.text, 'lxml')
    chapterName = chapterSoup.select('.chaptercontent > .clearfix > h1')[0].text
    chapterBody = chapterSoup.select('.chaptercontent > .content')[0].get_text('\n\t','br/')
    chapterBody = chapterBody.replace('applyChapterSetting();', '')
    print chapterName, pageUrl
    f.write('\r\n' + chapterName + '\r\n')
    f.write(chapterBody)
    nextChapter = chapterSoup.select('.chaptercontent > .operate > ul > .last > a')
    if len(nextChapter) == 0:
        nextChapter = chapterSoup.select('.operate > ul > li.last > a')
    return nextChapter[0]['href']

def parseNovelPage(pageUrl, startFlag):
    nextPageHref = startPage
    if not startFlag:
        infoPage = requests.get(pageUrl)
        infoSoup = BeautifulSoup(infoPage.text, 'lxml')
        firstPageTag = infoSoup.select('.container > .left > .info > .operate.clearfix > .btn.btn-primary')[0]
        firstPageHref = firstPageTag['href']
        nextPageHref = firstPageHref
    while nextPageHref != pageUrl:
        nextPageHref = parseChapterPage(nextPageHref)
        time.sleep(0.1)
        #break

def getSearchedBookUrl(searchPage, startFlag):
    soup = BeautifulSoup(searchPage.text, 'lxml')
    bookATag = soup.select('.container > .left > .lastest > ul > li > .n2 > a')[0]
    bookHref = bookATag['href']
    bookName = bookATag.text
    if not startFlag:
        f.write(bookName)
    print bookHref, bookName
    return bookHref

def main(targetBookUrl, startFlag):
    try:
        #print targetBookUrl, startFlag, startPage
        parseNovelPage(targetBookUrl, startFlag)
        return False
    except Exception as e:
        return True

if __name__ == '__main__':
    if len(sys.argv) != 2 and len(sys.argv) != 3:        
        print "usage : " + sys.argv[0] + " novelName "
        sys.exit(-2)

    startFlag = False

    reload(sys)
    sys.setdefaultencoding('utf-8')
    novelName = str(sys.argv[1])
    fileName = novelName.decode('utf-8').encode('gb2312') + '.txt'

    # if len(sys.argv) == 2:
    #     f = open(fileName, 'wb')
    # elif len(sys.argv) == 3:
    #     f = open(fileName, 'ab')
    #     startPage = str(sys.argv[2])
    #     startFlag = True

    f = open(fileName, 'wb')

    #NovelList.append(novelName)
    novelName = novelName
    dParam = {'keyword' : novelName}
    strParam = urllib.urlencode(dParam)
    searchUrl = websiteSearchUrl + '?' + strParam
    searchPage = requests.get(searchUrl)
    targetBookUrl = ''
    targetBookUrl = getSearchedBookUrl(searchPage, startFlag)
    nextLoop = True
    while nextLoop:
            nextLoop = main(targetBookUrl, startFlag)
            f.close()
            f = open(fileName, 'ab')
            startFlag = True
    #f.writelines(NovelList)
    f.close()
