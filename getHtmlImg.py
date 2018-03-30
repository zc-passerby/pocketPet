#! /usr/bin/python
#-*- coding: utf-8 -*-

import sys, os
import re, urllib, urllib2

#通过url获取网页
def getHtml(url):
    # 要设置请求头，让服务器知道不是机器人
    user_agent = 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)'
    headers = {'User-Agent': user_agent}

    request=urllib2.Request(url,headers=headers);
    page = urllib2.urlopen(request);
    html = page.read()
    return html


#通过正则表达式来获取图片地址，并下载到本地
def getImg(html):
    reg = r'url(.+?\.PNG)'
    imgre = re.compile(reg)
    imglist = imgre.findall(html)
    x = 0
    for imgurl in imglist:
        imgurl = "http://221.229.175.10:8088/" + imgurl[1:]
        print imgurl;
        imgName = imgurl.split('/')[-1]
        #通过urlretrieve函数把数据下载到本地的D:\\images，所以你需要创建目录
        urllib.urlretrieve(imgurl, 'F:\\Projects\\PocketPet\\public\\shapes\\%s' %imgName)
        x = x + 1

html = getHtml("http://221.229.175.10:8088/map2.html")
print html
getImg(html)