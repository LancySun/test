# test
http://www.cnblogs.com/EmptyFS/p/7479987.html
# -*- coding: utf-8 -*-
dashboard解析html文件


import os
import shutil
import datetime
from getJiraIssue import MyHTMLParser
from LightMysql import LightMysql
import pymysql
import datetime
from datetime import timedelta
import re
import sys
from atomdatabase import DataToMysql
import paramiko
import threading
import time
from jira import JIRA
from pygerrit2 import GerritRestAPI, HTTPBasicAuth
from requests.auth import HTTPDigestAuth



class Modelname(object):
    def __init__(self,host,user,pswd,database):
        self.db_modelname = DataToMysql(host,user,pswd,database)
        
    def Modelname_handle(self,template):
        rule = r'_(.*?)_'
        slotList = re.findall(rule, template)
        if not slotList:
            return slotList
        else:
            s = "("+"'"+slotList[0]+"'"+","+")"
            s1 = eval(s)
            return s1
        
    def models(self,path_root,root_directory_name):
        ite = file_handle()
        path_root_next = os.path.join(path_root,root_directory_name)
        item = ite.file2(path_root_next)
        return item
    def models1(self,path_root,root_directory_name):
        ite = file_handle()
        path_root_next = os.path.join(path_root,root_directory_name)
        item = ite.file1(path_root_next)
        return item
    def model_member(self,item_1,item):
        for model_member in item_1:
            if model_member in item:
                continue
            else:
                item.append(model_member)
        return item
    def modify_modelname(self,table_name):
        #临时方案
        alter_model_name = self.db_modelname.select3(table_name)
        for name in alter_model_name:
            name1 = name[0]
            part_name = 'ARTIK'
            if part_name in name1:
                part_name_last = part_name[-1]
                p = name1.index(part_name_last[-1])
                name1_1 = 'A' + name1[p+1:len(name1)]
                print(name1)
                if 'S' in name1:
                    p1 = name1_1.index('S')
                    name1_2 = name1_1[0:p1] + 's'
                    self.db_modelname.update3(table_name,repr(name1_2),repr(name1))
                else:
                    if 'IDE' in name1_1:
                        self.db_modelname.update3(table_name,repr('IDE'),repr(name1))
                    else:
                        self.db_modelname.update3(table_name,repr(name1_1),repr(name1))


class file_handle:
    def file2(self,path_root):
        item1=[]
        file_list2 = os.listdir(path_root)
        for i in file_list2:
            path2 = os.path.join(path_root,i)
            for dirpath, dirs, files in os.walk(path2):
                for name in files:
                    if os.path.splitext(name)[1] == '.html' and name.find("_email_") >= 0:
                        if i in item1:
                            continue
                        else:
                            item1.append(i)
                    else:
                        continue
        return item1
    def file1(self,path_root):
        item1=[]
        file_list2 = os.listdir(path_root)
        for i in file_list2:
            #path2 = os.path.join(path_root,i)
            for dirpath, dirs, files in os.walk(path_root):
            ##print(files)
                for name in files:
                    if os.path.splitext(name)[1] == '.html' and name.find("_email_") >= 0:

                        model_name = Modelname(host,user,pswd,database)
                        i_i = model_name.Modelname_handle(i)
                        for i_2 in i_i:
                            if i_2 in item1:
                                continue
                            else:
                                item1.append(i_2)
                    else:
                        continue
        return item1



class days_count:
    def week_get2(self,d):
        dayscount = datetime.timedelta(days=d.isoweekday())
        dayfrom = d - dayscount + datetime.timedelta(days=1)
        dayto = d - dayscount + datetime.timedelta(days=7)
        week7 = []
        i = 0
        while (i <= 6):
            day_oneweek = str(i+1)
            week7.append(str(dayfrom + datetime.timedelta(days=i)))
            i += 1
        return week7
    def week_get1(self,d):
        dayscount = datetime.timedelta(days=d.isoweekday())
        dayto = d - dayscount
        sixdays = datetime.timedelta(days=6)
        dayfrom = dayto - sixdays
        date_from = datetime.datetime(dayfrom.year, dayfrom.month, dayfrom.day, 0, 0, 0)
        date_to = datetime.datetime(dayto.year, dayto.month, dayto.day, 23, 59, 59)
        week7 = []
        i = 0
        while (i <= 6):
            week7.append(str(dayfrom + datetime.timedelta(days=i)))
            i += 1
        return week7
    def week_day_get(self,nweek):
        curr_date = datetime.datetime.now()
        dayscount = datetime.timedelta(days=curr_date.isoweekday())
        dayfrom = curr_date - dayscount + datetime.timedelta(days=1) - datetime.timedelta(weeks=nweek-1)
        week_days = []
        i = 0
        while (i < nweek * 7):
            day1 = str(i+1)
            week_days.append(str(dayfrom + datetime.timedelta(days=i))[0:10])
            i += 1
        return week_days
    def two_or_one_week(self):
        d = datetime.datetime.now()
        #d1 = days_count()
        #self.week_get1(d)
        w = []
        w1 = []
        print(self.week_get1(d))
        print(self.week_get2(d))
        for week1 in self.week_get1(d):
            w.append(week1)
        for week2 in self.week_get2(d):
            w1.append(week2)
            w.append(week2)
        day_twoweeks = []
        
        for i in w:
            i1= i[2:10]
            day_twoweeks.append(i1)
        print(day_twoweeks)
        day_oneweek = []
        for j in w1:
            j1 = j[2:10]
            day_oneweek.append(j1)
        print(day_oneweek)
        daylist = self.week_day_get(2)
        return day_twoweeks,day_oneweek,daylist
        
        
        
class Html_content:
    def content(self,fullname1):
        global p
        print("fullname1:",fullname1)
        file_content=open(fullname1,"r").read()
        parser = MyHTMLParser()
        parser.feed(file_content)
        if '.html' in fullname1:
            #print(MyHTMLParser.items)
            if 'PASS' in MyHTMLParser.items:
                p = MyHTMLParser.items.index('PASS')
                MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('PASS','P')
                #item1.append(MyHTMLParser.items[p])
            if 'FAIL' in MyHTMLParser.items:
                p = MyHTMLParser.items.index('FAIL')
                MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('FAIL','F')
                #item1.append(MyHTMLParser.items[p])
            if 'Conditional PASS' in MyHTMLParser.items:
                p = MyHTMLParser.items.index('Conditional PASS')
                MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Conditional PASS','C')
                #item1.append(MyHTMLParser.items[p])
            if 'Exception Happens' in MyHTMLParser.items:
                p = MyHTMLParser.items.index('Exception Happens')
                MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Exception Happens','E')
            #print(MyHTMLParser.items[p])
            return MyHTMLParser.items[p]
        else:
            return ''
        MyHTMLParser.items = []
    def content1(self,fullname3,i_is_html):
        global p
        #fullname3 =  os.path.join(path__1,i_is_html)                       
        file_content=open(fullname3,"r").read()
        parser = MyHTMLParser()
        parser.feed(file_content)
        m = Modelname(host,user,pswd,database)
        modelname1 = m.Modelname_handle(i_is_html)
        #print(MyHTMLParser.items[6])
        #if modelname1[0] in MyHTMLParser.items:
        if 'PASS' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('PASS')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('PASS','P,0')
        if 'FAIL' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('FAIL')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('FAIL','F,0')
        if 'Conditional PASS' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('Conditional PASS')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Conditional PASS','C,0')
        if 'Exception Happens' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('Exception Happens')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Exception Happens','E,0')
        return MyHTMLParser.items[1],MyHTMLParser.items[p],modelname1[0],MyHTMLParser.items[6]
        MyHTMLParser.items = []
    def content2(self,fullname3,i_is_html):
        global p
        #fullname3 =  os.path.join(path__1,i_is_html)                       
        file_content=open(fullname3,"r").read()
        parser = MyHTMLParser()
        parser.feed(file_content)
        m = Modelname(host,user,pswd,database)
        modelname1 = m.Modelname_handle(i_is_html)
        #if modelname1[0] in MyHTMLParser.items:
        if 'PASS' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('PASS')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('PASS','P')
        if 'FAIL' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('FAIL')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('FAIL','F')
        if 'Conditional PASS' in MyHTMLParser.items:
            p = MyHTMLParser.items.index('Conditional PASS')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Conditional PASS','C')
        if 'Exception Happens' in MyHTMLParser.items:
            print("@@@@@")
            print(MyHTMLParser.items)
            p = MyHTMLParser.items.index('Exception Happens')
            MyHTMLParser.items[p] = MyHTMLParser.items[p].replace('Exception Happens','E')
        return MyHTMLParser.items[1],MyHTMLParser.items[p],modelname1[0],MyHTMLParser.items[6]
        MyHTMLParser.items = []


class ST_table:
    def __init__(self,st_chart,cat_daily_chart,cat_weekly_chart,cat_aging_chart,daily_detail,weekly_detail,aging_detail,host,user,pswd,database):
        self.st_chart = st_chart
        self.cat_daily_chart = cat_daily_chart
        self.cat_weekly_chart = cat_weekly_chart
        self.cat_aging_chart = cat_aging_chart
        self.daily_detail = daily_detail
        self.weekly_detail = weekly_detail
        self.aging_detail = aging_detail
        self.db_st = DataToMysql(host,user,pswd,database)
        self.st_m = Modelname(host,user,pswd,database)
        self.st_h = Html_content()
    def id_statistics(self,table_name):
        num = self.db_st.select1(table_name)
        for im in num:
            print()
            for tm in im:
                print()
        return tm
        
    #ò?è??ú?a???t??3?μ?ST±í′|àí
    def not_daily_st(self,day_twoweeks,all_filename,path_root,):
        column_name = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon1','Tue1','Wed1','Thu1','Fri1','Sat1','Sun1']
        column_count = 0
        #′|àíweeklyêy?YDèòa
        weekly_set = {}
        weekly_set2 = {}

        st_daily_usecase_count = {}
        st_weekly_usecase_count = {}
        st_aging_usecase_count = {}
               
        self.db_st.truncate(self.cat_daily_chart)  
        self.db_st.truncate(self.cat_weekly_chart)  
        self.db_st.truncate(self.cat_aging_chart) 
        self.db_st.truncate(self.st_chart) 
        #?òst±í?D2?è?model??
        for i_day3 in day_twoweeks:
            item = []
            #???t?????DóD?aò?ìì
            if i_day3 in all_filename:
                #??è?model??3?
                item_1 = self.st_m.models1(path_root,i_day3)
                item = self.st_m.model_member(item_1,item)
                #?ò±í?D2?è?model
                self.db_st.model_column(self.st_chart,item)
                self.db_st.model_column(self.cat_daily_chart,item)
                self.db_st.model_column(self.cat_weekly_chart,item)
                self.db_st.model_column(self.cat_aging_chart,item)
            else:
                continue
        #st±í?￡?é
        for i_day in day_twoweeks:
            item = []
            item_modelname = []
            
            #???t?????DóD?aò?ìì
            if i_day in all_filename:
                print('1',i_day)
                #??è?model??3?
                item_1 = self.st_m.models1(path_root,i_day)
                item = self.st_m.model_member(item_1,item)
                #??è???ìì?·????μ??ùóD???t??3?
                path__1 = os.path.join(path_root,i_day)
                filelist = os.listdir(path__1)
                item1_st = []
                item2_st = []
                item3_st = []
                item1_st_daily = {}
                item2_st_weekly = {}
                item2_st_weekly_1 = {}
                item3_st_aging = {}
                same_daily_modelname = []
                same_weekly_modelname = []
                same_aging_modelname = []
                '''
                st_daily_usecase_count = {}
                st_weekly_usecase_count = {}
                st_aging_usecase_count = {}
                '''
                #±éàúhtml???t??3??°?úèY
                for i_is_html in filelist:
                    print(i_is_html)
                    date_weekly = ''
                    date_aging = ''
                    #?D??·?o?òa?óμ????t??3?￡?2￠·??ê?ùDèD??￠
                    if '.html' in i_is_html:
                        if 'unit' in i_is_html:
                            continue
                            
                        else:
                            # init?Dst_m ?aModelname￡? á?′|???′
                            model_name = Modelname(host,user,pswd,database)
                            model = model_name.Modelname_handle(i_is_html)
                            #2é?ˉweekly?úèY
                            if 'weekly' in i_is_html:
                                flag = 0
                                if model in same_weekly_modelname:
                                    print("this model exists")
                                    fullname2 =  os.path.join(path__1,i_is_html)
                                    a = self.st_h.content1(fullname2,i_is_html)
                                    a2 = a[0]
                                    date_weekly = a2[40:48]
                                    weekly_set2[model,date_weekly] = a[1]
                                    if 'F' in a[1]:
                                        item2_st_weekly[model] = a[1]
                                    print("####################################################")
                                    print(date_weekly,'1')
                                    for weekly_count in st_weekly_usecase_count.keys():
                                        print(weekly_count[0])
                                        if model == weekly_count[0]:
                                            print('11:',date_weekly)
                                            print(weekly_count)
                                            date_weekly_in = weekly_count[1]
                                            print(date_weekly_in)
                                            if '-' in date_weekly_in:
                                                if '-' in  date_weekly:
                                                    pass
                                                else: 
                                                    if '/' in date_weekly:
                                                        date_weekly = '18-'+date_weekly[1:3]+'-'+date_weekly[4:6]
                                                date_weekly_in_1 = date_weekly_in.strip().split('-')
                                                date_weekly_1 = date_weekly.strip().split('-')
                                                month_in = int(date_weekly_in_1[1])
                                                month = int(date_weekly_1[1])
                                                if month_in > month:
                                                    flag = 1
                                                elif month_in == month:
                                                    day_in = int(date_weekly_in_1[2])
                                                    day = int(date_weekly_1[2]) 
                                                    if day_in > day:
                                                        flag = 1
                                                else:
                                                    pass
                                            else:
                                                if '/' in date_weekly_in:
                                                    if '/' in  date_weekly:
                                                        pass
                                                    else: 
                                                        if '-' in date_weekly:
                                                            date_weekly = '/'+date_weekly[3:5]+'/'+date_weekly[6:8]
                                                print(date_weekly_in)
                                                date_weekly_in_1 = date_weekly_in.strip().split('/')
                                                date_weekly_1 = date_weekly.strip().split('/')
                                                print(date_weekly_in_1)
                                                month_in = int(date_weekly_in_1[1])
                                                month = int(date_weekly_1[1])
                                                if month_in > month:
                                                    flag = 1
                                                elif month_in == month:
                                                    day_in = int(date_weekly_in_1[2])
                                                    day = int(date_weekly_1[2]) 
                                                    if day_in > day:
                                                        flag = 1
                                                else:
                                                    pass



                                            print('22:',date_weekly)
                                            #一个model结束日期在同一天
                                            if date_weekly in date_weekly_in:
                                                if a[1] == 'E,0':
                                                    pass
                                                else:
                                                    print('in:',date_weekly)
                                                    item1_st_weekly_result = a[3]
                                                    item1_st_weekly_result_list = item1_st_weekly_result.split('/')
                                                    item1_st_weekly_result_pass = int(item1_st_weekly_result_list[1])
                                                    item1_st_weekly_result_fail = int(item1_st_weekly_result_list[2])
                                                    #print(st_weekly_usecase_count[weekly_count])
                                                    print('st_weekly_usecase_count[weekly_count]:',st_weekly_usecase_count[weekly_count])
                                                    all_count =  list(st_weekly_usecase_count[weekly_count])
                                                    all_count[0] = all_count[0] + item1_st_weekly_result_pass
                                                    all_count[1] = all_count[1] + item1_st_weekly_result_fail
                                                    st_weekly_usecase_count[weekly_count] = tuple(all_count)
                                                    print('st_weekly_usecase_count[weekly_count]:',st_weekly_usecase_count[weekly_count])
                                            #结束日期不在同一天，取最新结果
                                            else:
                                                if flag == 1:
                                                    print('Exception:',date_weekly)
                                                    print('st_weekly_usecase_count[weekly_count]:',st_weekly_usecase_count[weekly_count])
                                                    pass
                                                else:
                                                    print('out:',date_weekly)
                                                    print('st_weekly_usecase_count[weekly_count]:',st_weekly_usecase_count[weekly_count])
                                                    if a[1] == 'E,0':
                                                        pass
                                                    else:
                                                        item1_st_weekly_result = a[3]
                                                        item1_st_weekly_result_list = item1_st_weekly_result.split('/')
                                                        item1_st_weekly_result_pass = int(item1_st_weekly_result_list[1])
                                                        item1_st_weekly_result_fail = int(item1_st_weekly_result_list[2])  
                                                        st_weekly_usecase_count[weekly_count] = item1_st_weekly_result_pass,item1_st_weekly_result_fail 
                                                    print('st_weekly_usecase_count[weekly_count]:',st_weekly_usecase_count[weekly_count])
                                else:
                                    same_weekly_modelname.append(model)
                                    fullname2 =  os.path.join(path__1,i_is_html)
                                    a = self.st_h.content1(fullname2,i_is_html)
                                    a2 = a[0]
                                    date_weekly = a2[40:48]
                                    item2_st_weekly[model] = a[1]  
                                     
                                    if a[1] == 'E,0':
                                        weekly_set2[model,i_day] = a[1]
                                        item1_st_weekly_result_pass = 0
                                        item1_st_weekly_result_fail = 0  
                                        #exception 情况date_weekly为空，所以取文件名中的时间i_day
                                        st_weekly_usecase_count[model,i_day] = item1_st_weekly_result_pass,item1_st_weekly_result_fail
                                    else:
                                        weekly_set2[model,date_weekly] = a[1]
                                        item1_st_weekly_result = a[3]
                                        item1_st_weekly_result_list = item1_st_weekly_result.split('/')
                                        item1_st_weekly_result_pass = int(item1_st_weekly_result_list[1])
                                        item1_st_weekly_result_fail = int(item1_st_weekly_result_list[2])  
                                        st_weekly_usecase_count[model,date_weekly] = item1_st_weekly_result_pass,item1_st_weekly_result_fail                            
                                print("item2_st_weekly:",item2_st_weekly)
                            else:
                                if 'pilot' in i_is_html:
                                    print("2?1ü")    
                                else:
                                    if 'daily' in i_is_html:
                                        
                                        if model in same_daily_modelname:
                                            #print("??model3???1y")
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.st_h.content1(fullname2,i_is_html)
                                            a2 = a[0]
                                            date_weekly1 = a2[10:18]
                                            # ?éò??ù???ó??·?E C ?é??
                                            if 'F' in a[1]:
                                                item1_st_daily[model] = a[1]
                                    
                                            if a[1] == 'E,0':
                                                '''
                                                item1_st_daily_result_pass = 0
                                                item1_st_daily_result_fail = 0  
                                                st_daily_usecase_count[model] = item1_st_daily_result_pass,item1_st_daily_result_fail
                                                '''
                                                pass
                                            else:
                                                item1_st_daily_result = a[3]
                                                #print('11111111111item1_st_daily_result_list:',item1_st_daily_result)
                                                item1_st_daily_result_list = item1_st_daily_result.split('/')
                                                item1_st_daily_result_pass = int(item1_st_daily_result_list[1])
                                                item1_st_daily_result_fail = int(item1_st_daily_result_list[2])
                                                all_count =  list(st_daily_usecase_count[model])
                                                #fail pass ??êy?a?à′?à??ó
                                                all_count[0] = all_count[0] + item1_st_daily_result_pass
                                                all_count[1] = all_count[1] + item1_st_daily_result_fail
                                                st_daily_usecase_count[model] = tuple(all_count)

                                        else:
                                            same_daily_modelname.append(model)
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.st_h.content1(fullname2,i_is_html)
                                            a2 = a[0]
                                            date_weekly1 = a2[10:18]
                                            item1_st_daily[model] = a[1]
                                            #print('111112item1_st_daily_result_list:',item1_st_daily_result)
                                            #print('item1_st_daily[model]:',item1_st_daily[model])
                                            if a[1] == 'E,0':
                                                item1_st_daily_result_pass = 0
                                                item1_st_daily_result_fail = 0  
                                                st_daily_usecase_count[model] = item1_st_daily_result_pass,item1_st_daily_result_fail
                                            else:
                                                item1_st_daily_result = a[3]
                                                print('111112item1_st_daily_result_list:',item1_st_daily_result)
                                                item1_st_daily_result_list = item1_st_daily_result.split('/')
                                                item1_st_daily_result_pass = int(item1_st_daily_result_list[1])
                                                item1_st_daily_result_fail = int(item1_st_daily_result_list[2])  
                                                st_daily_usecase_count[model] = item1_st_daily_result_pass,item1_st_daily_result_fail
                                        #print("item1_st_daily:",item1_st_daily)
                                    else:
                                        #′|àíaging?úèY
                                        if 'aging' in i_is_html:
                                            if model in same_aging_modelname:
                                                print("??model3???1y")
                                                fullname2 =  os.path.join(path__1,i_is_html)
                                                a = self.st_h.content1(fullname2,i_is_html)
                                                a2 = a[0]
                                                date_weekly1 = a2[40:48]
                                                if 'F' in a[1]:
                                                    item3_st_aging[model] = a[1]
                                                
                                                item1_st_aging_result = a[3]
                                                item1_st_aging_result_list = item1_st_aging_result.split('/')
                                                item1_st_aging_result_pass = int(item1_st_aging_result_list[1])
                                                item1_st_aging_result_fail = int(item1_st_aging_result_list[2])
                                                all_count =  list(st_aging_usecase_count[model])
                                                all_count[0] = all_count[0] + item1_st_aging_result_pass
                                                all_count[1] = all_count[1] + item1_st_aging_result_fail
                                                st_aging_usecase_count[model] = tuple(all_count)
                                                
                                            else:
                                                same_aging_modelname.append(model)
                                                fullname2 =  os.path.join(path__1,i_is_html)
                                                a = self.st_h.content1(fullname2,i_is_html)
                                                a2 = a[0]
                                                date_weekly1 = a2[10:18]
                                                item3_st_aging[model] = a[1]
                                                
                                                if a[1] == 'E,0':
                                                    item1_st_aging_result_pass = 0
                                                    item1_st_aging_result_fail = 0  
                                                    st_aging_usecase_count[model] = item1_st_aging_result_pass,item1_st_aging_result_fail
                                                else:
                                                    item1_st_aging_result = a[3]
                                                    item1_st_daily_result_list = item1_st_aging_result.split('/')
                                                    item1_st_aging_result_pass = int(item1_st_daily_result_list[1])
                                                    item1_st_aging_result_fail = int(item1_st_daily_result_list[2])  
                                                    st_aging_usecase_count[model] = item1_st_aging_result_pass,item1_st_aging_result_fail
                                                
                                            #print("item3_st_aging:",item3_st_aging)
                        #print('44444444444444',weekly_set2)
                        #weekly_set[model,date_weekly] = a[1]
                        item1_st = list(item1_st_daily.values())
                        item2_st = list(item2_st_weekly.values())
                        item3_st = list(item3_st_aging.values())

                        #??′???è?íêí?ò3?ùDè?úèY??oóDèòa???? MyHTMLParser.items ?Dμ??úèY
                        MyHTMLParser.items = []                        
                
                #caculate the usecases of daily,weekly,aging and insert the data in each table
                today_date = str(datetime.datetime.now())
                concrete_today_date = today_date[2:10]
                print(concrete_today_date)
                if i_day == concrete_today_date:
                    if not st_weekly_usecase_count and not st_aging_usecase_count:
                        pass
                    else:
                        
                        model_list_useless_2 = self.db_st.select3(self.aging_detail)
                        for model2 in model_list_useless_2:
                            if model2 in st_aging_usecase_count.keys():
                                pass
                            else:
                                self.db_st.delete(self.aging_detail,repr(model2[0]))
                                
                        model_list_useless_1 = self.db_st.select3(self.weekly_detail)
                        for model1 in model_list_useless_1:
                            if model1 in st_weekly_usecase_count.keys():
                                pass
                            else:
                                self.db_st.delete(self.weekly_detail,repr(model1[0]))
                        
                        model_list_useless = self.db_st.select3(self.daily_detail)
                        for model in model_list_useless:
                            if model in st_daily_usecase_count.keys():
                                pass
                            else:
                                self.db_st.delete(self.daily_detail,repr(model[0]))
                        
                        for model_volumn_name_2 in st_aging_usecase_count.keys():
                            model_volumn_name1_2 = model_volumn_name_2[0]
                            usecase_status = st_aging_usecase_count[model_volumn_name_2]
                            p2 = usecase_status[0]
                            f2 = usecase_status[1]
                            model_list_2 = self.db_st.select3(self.aging_detail)
                            print(model_list_2)
                            if model_volumn_name_2 in model_list_2:
                                pass
                            else:
                                self.db_st.insert(self.aging_detail,'model',repr(model_volumn_name1_2))
                        
                            self.db_st.update2(self.aging_detail,repr(p2),repr(f2),repr(model_volumn_name1_2))
                        for model_volumn_name_1 in st_weekly_usecase_count.keys():
                            model_volumn_name1_1 = model_volumn_name_1[0]
                            model_volumn_name1_2 = model_volumn_name1_1[0]
                            usecase_status = st_weekly_usecase_count[model_volumn_name_1]
                            p1 = usecase_status[0]
                            f1 = usecase_status[1]
                            model_list_1 = self.db_st.select3(self.weekly_detail)
                            print(model_list_1)
                            if model_volumn_name1_1 in model_list_1:
                                  pass
                            else:
                                self.db_st.insert(self.weekly_detail,'model',repr(model_volumn_name1_2))
        
                            self.db_st.update2(self.weekly_detail,repr(p1),repr(f1),repr(model_volumn_name1_2))
                    for model_volumn_name in st_daily_usecase_count.keys():
                            model_volumn_name1 = model_volumn_name[0]
                            usecase_status = st_daily_usecase_count[model_volumn_name]
                            p = usecase_status[0]
                            f = usecase_status[1]
                            model_list = self.db_st.select3(self.daily_detail)
                            print(model_list)
                            if model_volumn_name in model_list:
                                pass
                            else:
                                self.db_st.insert(self.daily_detail,'model',repr(model_volumn_name1))
    
                            self.db_st.update2(self.daily_detail,repr(p),repr(f),repr(model_volumn_name1))
                else:
                    print("bugaizhetian")
                print(today_date,i_day)
                for col in item1_st_daily.keys():
                    item_modelname.append(col[0])                                 
                for col1 in item2_st_weekly.keys():
                    if col1[0] in item_modelname:
                        continue
                    else:
                        item_modelname.append(col1[0])
                
                print(item_modelname)
                #insert daily,weekly,aging data directly
                #print("------------------------------------------")
                for e,t in zip(item1_st,item_modelname):
                    self.db_st.update1(self.cat_daily_chart,column_name[column_count],repr(e[0]),repr(t))
                #print("item2_st_weekly:",item2_st_weekly)
                
                #agingμ￥?à′|àí
                if not item3_st_aging:
                    item = ''
                    for t in item_modelname:
                        self.db_st.update1(self.cat_aging_chart,column_name[column_count],repr(item),repr(t))
                else:
                    for t in item3_st_aging.keys():
                        t1 = item3_st_aging[t]
                        self.db_st.update1(self.cat_aging_chart,column_name[column_count],repr(t1[0]),repr(t[0]))
                #print("weekly_set:",weekly_set)
                print('****************************************************8')
                #ìáè?3?μ±ììμ?weeklyêy?Y
                print(weekly_set2)
                new_weekly_set = {}
                keys_list = []
                for keys in weekly_set2.keys():
                    keys_day = keys[1]
                    if i_day == keys_day:
                        if keys[0] in keys_list:
                            if weekly_set2[keys] == 'F,0':
                                new_weekly_set[keys[0]] = 'F,0'
                        else:
                                    
                            keys_list.append(keys[0])
                            new_weekly_set[keys[0]] = weekly_set2[keys]
                    else:
                        if '/' in keys_day:
                            i_day1 = '/' + i_day[3:5] +'/' +i_day[6:8]
                            if i_day1 in keys_day:
                                if keys[0] in keys_list:
                                    if weekly_set2[keys] == 'F,0':
                                        new_weekly_set[keys[0]] = 'F,0'
                                else:
                                    
                                    keys_list.append(keys[0])
                                    new_weekly_set[keys[0]] = weekly_set2[keys]
                print(new_weekly_set)
                #?òweeklyμ￥?à±í?D2?è?êy?Y
                if not new_weekly_set:
                    pass
                else:
                    for new1 in new_weekly_set.keys():
                        value1 = new_weekly_set[new1]
                        self.db_st.update1(self.cat_weekly_chart,column_name[column_count],repr(value1[0]),repr(new1[0]))
                #new_weekly_setó?μ±ììdailyêy?Y??DDó?2ù×÷
                for new in item1_st_daily.keys():
                    if new in new_weekly_set.keys():
                        print(new_weekly_set[new])
                        if new_weekly_set[new] == 'F,0':
                            item1_st_daily[new] = 'F,0'
                print('item1_st_daily:',item1_st_daily)
                
                #print("item3_st_aging:",item3_st_aging)
                for s in item3_st_aging.keys():
                    if s in item1_st_daily.keys():
                        str_item1_st_daily = item1_st_daily[s]
                        str_item3_st_aging = item3_st_aging[s]
                        item1_st_daily[s] = str_item1_st_daily[0:2]+str_item3_st_aging[0]
                        print(item1_st_daily[s])
                #print("item1_st_daily:",item1_st_daily)
                item1_st = list(item1_st_daily.values())
                #2?è?o?óD'daily'êy?Y
                for t in item_modelname:
                    print(t)
                    t1 ="("+"'"+t+"'"+","+")"
                    t2 = eval(t1)
                    if t2 in item1_st_daily.keys():
                        self.db_st.update1(self.st_chart,column_name[column_count],repr(item1_st_daily[t2]),repr(t))
                    else:
                        item = '0,0'
                        self.db_st.update1(self.st_chart,column_name[column_count],repr(item),repr(t))
                r = self.db_st.select5(column_name[column_count],self.st_chart)
                #print("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                print(r)
                Num = 0
                for rr in r:
                    Num = Num +1
                    if rr == (None,):
                        rr = '0,0'
                        self.db_st.update(self.st_chart,column_name[column_count],repr(rr),Num)

                column_count=column_count+1
                
            #???t??????óD?aò?ìì
            else:
                item2_st_weekly_2 = {}
                item2_st_1 = []
                tm_daily = self.id_statistics(self.cat_daily_chart)
                tm_aging = self.id_statistics(self.cat_aging_chart)
                item = ''
                for i in range(1,tm_daily+1):
                    self.db_st.update(self.cat_daily_chart,column_name[column_count],repr(item),i)
                for i in range(1,tm_aging+1):
                    self.db_st.update(self.cat_aging_chart,column_name[column_count],repr(item),i)
                item1_st_1 = {}
                item1_st_1_weekly=[]
                item1_st_1_copy = ['']
                i_m1 = []
                #?????D??óD3???o?óDweeklyμ?html???t
                #weekly_set2?a??
                if not weekly_set2:
                    tm_weekly = self.id_statistics(self.cat_weekly_chart)
                    for i in range(1,tm_weekly+1):
                        self.db_st.update(self.cat_weekly_chart,column_name[column_count],repr(item),i)
                    #?D???üììê?·?ò??-2?è??μ
                    result = self.db_st.select(column_name[column_count],self.st_chart)
                    result1 = list(result)
                    tm= self.id_statistics(self.st_chart)                    
                    for im1 in range(0,tm):
                        i_m1.append((None,))
                    #è?1???óD2?è??μ???±?óì???
                    if result1 == i_m1:
                        item2 = '0,0'
                        for i in range(1,tm+1):
                            self.db_st.update(self.st_chart,column_name[column_count],repr(item2),i)
                    else:
                        #·??òì?3??-?·
                        k = []
                        for j in result1:
                            #print(j)
                            if j ==('P',):
                                k.append(('P,0',))
                            else:
                                if j ==('F',):
                                   k.append(('F,0',)) 
                                else:
                                    if j==('E',):
                                       k.append(('E,0',))
                                    else:
                                       k.append(('0,0',))
                        print(k)
                        for t,i in zip(k,range(1,tm+1)):
                            num = self.db_st.select1(self.st_chart)
                            for im in num:
                                print(im)
                                for tm in im:
                                    print(tm)
                            for t1 in t:
                                print(t1)
                                self.db_st.update(self.st_chart,column_name[column_count],repr(t1),i)
                    column_count=column_count+1
                #weekly_set22??a??
                
                else:
                    print('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
                    print("!!!!weekly_set2:",weekly_set2)
                    #print("item2_st_weekly_2:",item2_st_weekly_2)
                    keys_list1 = []
                    new_weekly_set1 = {}
                    for keys1 in weekly_set2.keys():
                        keys_day1 = keys1[1]
                        
                        if i_day == keys_day1:
                            if keys1[0] in keys_list1:
                                print(i_day)
                                print('1:',keys1[0])
                                if weekly_set2[keys1] == 'F,0':
                                    new_weekly_set1[keys1[0]] = 'F,0'
                            else:
                                print('1')    
                                keys_list1.append(keys1[0])
                                new_weekly_set1[keys1[0]] = weekly_set2[keys1]
                        else:
                            if '/' in keys_day:
                                i_day1 = '/' + i_day[3:5] +'/' +i_day[6:8]
                                if i_day1 in keys_day1:
                                    if keys1[0] in keys_list1:
                                        print(i_day1)
                                        print('2:',keys1[0])
                                        if weekly_set2[keys1] == 'F,0':
                                            new_weekly_set1[keys1[0]] = 'F,0'
                                    else:
                                        print('2')
                                        keys_list1.append(keys1[0])
                                        new_weekly_set1[keys1[0]] = weekly_set2[keys1]
                    
                    print('new_weekly_set1:',new_weekly_set1)
                    modelname = self.db_st.select3(self.st_chart)
                    print("modelname:",modelname)
                    if not new_weekly_set1:
                        for mm in modelname:
                            self.db_st.update1(self.st_chart,column_name[column_count],repr('0,0'),repr(mm[0]))
                    else:
                        for kk in modelname:
                            if kk in new_weekly_set1.keys():
                                self.db_st.update1(self.st_chart,column_name[column_count],repr(new_weekly_set1[kk]),repr(kk[0]))
                            else:
                                self.db_st.update1(self.st_chart,column_name[column_count],repr('0,0'),repr(kk[0]))
                        #??weeklyμ￥?à±íμ?2ù×÷
                        for new1 in new_weekly_set1.keys():
                            value = new_weekly_set1[new1]
                            self.db_st.update1(self.cat_weekly_chart,column_name[column_count],repr(value[0]),repr(new1[0]))
                    column_count=column_count+1
    # ò?daily?a???t??3éμ?ST′|àí
    def daily_st(self,item_1,path_root_next,day_twoweeks):
        for i_st in item_1:
            print("?￡?é??3?")
            print(i_st)
            path = os.path.join(path_root_next,i_st)
            file_list=os.listdir(path) #??è????¨μ?????
            item4_st = []
            for k_st in day_twoweeks:
                print(k_st)
                if k_st in file_list:
    
                    print("???t?D?DóD?aò?ììμ?êy?Y")
                    for filename in os.listdir(path):
    
                        if filename==k_st:
                                #???ˉμ??·
                            fullname = os.path.join(path,filename)
                            print(fullname)
                            #??è???ì??3ò?ìì??????μ????táD±í
                            file_list1 = os.listdir(fullname)
                            print(file_list1)
                            if not file_list1:
                                #item1.append('')
                                item4_st.append('')
                            ##print(file_list1)
                            else:
                                s_st = 0
                                item2 = []
                                item1_st = []
                                #?ù?Y???t??2?í???2?í¨μ?±í?D2?è?êy?Y
                                for k1_st in file_list1:                                
                                    if 'unit' not in k1_st:
                                        s_st = s_st+1
                                        fullname1 = os.path.join(fullname,k1_st)  
                                        #??è?í?ò3?′??                         
                                        file_content=open(fullname1,"r").read()
                                        parser = MyHTMLParser()
                                        parser.feed(file_content)
                                        cn = Html_content()
                                        print(item1_st)
                                        item1_st.append(cn.content(fullname1))
                                        print("hhahahahahahahahah",item1_st)
                                        
                                        if s_st>1:
                                            if len(item1_st)>1:
                                                for i_2_st in item1_st:
                                                    if i_2_st == 'F':
                                                        item1_st = ['F']
                                                        item4_st.pop()
                                                        item4_st.append(item1_st[0])
                                        else:
                                            item4_st.append(item1_st[0])
                                        print(item4_st)
                                    else:
                                        continue
                else:
                    print("???t?D?D??óD?aò?ììμ?êy?Y")
                    item4_st.append('')
            print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            print(item4_st)

            result4 = self.db_st.select3(self.st_chart)
            print(result4)
            item5_st = []
            i_st_1 = "("+"'"+i_st+"'"+","+")"
            print(i_st_1)
            i_st_2 = eval(i_st_1)
            #for ii in result4:
            if i_st_2 in result4:
                print("??modelò??-óD?μ")
                r = self.db_st.select4(self.st_chart,repr(i_st))
                print("SSSSSSSSSSSSSSS")
                print(r)
                b = list(r)
                print(list(b[0]))
                new = []
                #ii = ['', 'F', '', '', '', '', '', '', '', '', '', '', '', '']
                for i,i1 in zip(range(2,len(list(b[0]))),item4_st):
                    c=list(b[0])
                    #print(c[i])
                    if i1 =='':
                        new.append(c[i])
                    else:
                        if i1 == 'F':
                            d = c[i]
                            d = i1+d[1:3]
                            new.append(d)
                        else:
                            if i1 =='C':
                                d = c[i]
                                d = i1+d[1:3]
                                new.append(d) 
                            else:
                                new.append(c[i])
                print(new)
                if len(new) <15:
                    count =  15 - len(new)
                    for i_1_st in range(0,count):
                        new.append('0,0')
                print(new)
                new[7]=''
                print(new)
                i1 = new[0]
                i2 = new[1]
                i3 = new[2]
                i4 = new[3]
                i5 = new[4]
                i6 = new[5]
                i7 = new[6]
                i8 = new[7]
                i9 = new[8]
                i10 = new[9]
                i11 = new[10]
                i12 = new[11]
                i13 = new[12]
                i14 = new[13]
                i15 = new[14]
                self.db_st.update_not_daily(self.st_chart,repr(i1),repr(i2),repr(i3),repr(i4),repr(i5),repr(i6),repr(i7),repr(i8),repr(i9),repr(i10),repr(i11),repr(i12),repr(i13),repr(i14),repr(i15),repr(i_st))
            else:
                self.db_st.insert(self.st_chart,'model',repr(i_st))
                for ii1 in item4_st:
                    if ii1 == '':
                        item5_st.append("0,0")
                    else:
                        item5_st.append(ii1+',0')
                if len(item5_st) <14:
                    count =  14 - len(item5_st)
                    for i_1_st in range(0,count):
                        item5_st.append('0,0')
                print(item5_st)
                item5_st.insert(7,'')
                print(item5_st)
                i1 = item5_st[0]
                i2 = item5_st[1]
                i3 = item5_st[2]
                i4 = item5_st[3]
                i5 = item5_st[4]
                i6 = item5_st[5]
                i7 = item5_st[6]
                i8 = item5_st[7]
                i9 = item5_st[8]
                i10 = item5_st[9]
                i11 = item5_st[10]
                i12 = item5_st[11]
                i13 = item5_st[12]
                i14 = item5_st[13]
                i15 = item5_st[14]
                self.db_st.update_not_daily(self.st_chart,repr(i1),repr(i2),repr(i3),repr(i4),repr(i5),repr(i6),repr(i7),repr(i8),repr(i9),repr(i10),repr(i11),repr(i12),repr(i13),repr(i14),repr(i15),repr(i_st))
            result_st = self.db_st.select4(self.st_chart,repr(i_st))
            print(result_st)
            result_st1 = result_st[0]
            result_st2 = list(result_st1)
            print(result_st2)
            n = 0
            for r in result_st2:
                if r =='0,0':
                    n = n+1
                else:
                    continue
            print(n)
            if n == 14:
                self.db_st.delete(self.st_chart,repr(i_st))
        self.st_m.modify_modelname(self.st_chart)
        self.st_m.modify_modelname(self.cat_daily_chart)
        self.st_m.modify_modelname(self.cat_weekly_chart)
        self.st_m.modify_modelname(self.cat_aging_chart)
        self.st_m.modify_modelname(self.daily_detail)
        self.st_m.modify_modelname(self.weekly_detail)
        self.st_m.modify_modelname(self.aging_detail)
        '''
        #临时方案
        alter_model_name = self.db_st.select3(self.st_chart)
        for name in alter_model_name:
            name1 = name[0]
            part_name = 'ARTIK'
            if part_name in name1:
                part_name_last = part_name[-1]
                p = name1.index(part_name_last[-1])
                name1_1 = 'A' + name1[p+1:len(name1)]
                print(name1)
                if 'S' in name1:
                    p1 = name1_1.index('S')
                    name1_2 = name1_1[0:p1] + 's'
                    self.db_st.update3(self.st_chart,repr(name1_2),repr(name1))
                else:
                    if 'IDE' in name1_1:
                        self.db_st.update3(self.st_chart,repr('IDE'),repr(name1))
                    else:
                        self.db_st.update3(self.st_chart,repr(name1_1),repr(name1))
                                    
        '''

class UT_table(object):
    def __init__(self, ut_chart, cat_ut_chart,defact_statistics_test1,host,user,pswd,database):
        self.ut_chart = ut_chart
        self.cat_ut_chart = cat_ut_chart
        self.defact_statistics_test1 = defact_statistics_test1
        self.db_ut  = DataToMysql(host,user,pswd,database)
        self.ut_m = Modelname(host,user,pswd,database)
        self.ut_h = Html_content()

    def id_statistics_1(self,table_name):
        num = self.db_ut .select1(table_name) 
        for im in num:
            print()
            for tm in im:
                print()
        return tm
    def not_daily_ut(self,day_oneweek,all_filename,path_root):
        self.db_ut .truncate(self.ut_chart)
        weekly_set = {}  
        column_name_ = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
        column_count_ = 0
        for i_day3 in day_oneweek:
            item = []
            print(i_day3)
            #???t?????DóD?aò?ìì
            if i_day3 in all_filename:
                #??è?model??3?
                item_1 = self.ut_m.models1(path_root,i_day3)
                item = self.ut_m.model_member(item_1,item)
                #?ò±í?D2?è?model
                self.db_ut .model_column(self.ut_chart,item)
            else:
                continue
        for i_day1 in day_oneweek:
            item1_unit = []
            item = []
            item_modelname = []
            #???t?????DóD?aò?ìì
            if i_day1 in all_filename:
                print(i_day1)
                #??è?model??3?
                
                item_1 = self.ut_m.models1(path_root,i_day1)
                item = self.ut_m.model_member(item_1,item)
                print(item)
                #?ò±í?D2?è?model
                self.db_ut .model_column(self.ut_chart,item)
                #??è???ìì?·????μ??ùóD???t??3?
                path__1 = os.path.join(path_root,i_day1)
                filelist = os.listdir(path__1)
                item1_unit = []
                item2_unit = []
                date_weekly_st1 = []
                item1_ut_daily = {}
                item2_ut_weekly = {}
                item3_ut_aging = {}
                same_daily_modelname = []
                same_weekly_modelname = []
                same_aging_modelname = []
                ut_usecase_count = {}
                #±éàú???t??3??ˉo?
                for i_is_html in filelist:
                    
                    date_weekly_ = ''
                    #?D??·?o?òa?óμ????t??3?
                    if '.html' in i_is_html:
                        ##print("ê?html???t")
                        if 'unit' in i_is_html:
                            print(i_is_html)
                            model_name = Modelname(host,user,pswd,database)
                            model = model_name.Modelname_handle(i_is_html)
                            ##print("Dèòa2?è?μ?ut±í?D")
                            if 'weekly' in i_is_html:
                                if model in same_weekly_modelname:
                                    print("??model3???1y")
                                    fullname2 =  os.path.join(path__1,i_is_html)
                                    a = self.ut_h.content2(fullname2,i_is_html)
                                    a2 = a[0]
                                    date_weekly = a2[40:48]
                                    if 'F' in a[1]:
                                        item2_ut_weekly[model] = a[1]
                                else:
                                    same_weekly_modelname.append(model)
                                    fullname2 =  os.path.join(path__1,i_is_html)
                                    a = self.ut_h.content2(fullname2,i_is_html)
                                    a2 = a[0]
                                    date_weekly = a2[40:48]
                                    item2_ut_weekly[model] = a[1]                                      
                                print("3",item2_ut_weekly)                 
                            else:
                                if 'pilot' in i_is_html:
                                    print("2?1ü")
                                else:
                                    if 'aging' in i_is_html:
                                        if model in same_aging_modelname:
                                            print("??model3???1y")
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.ut_h.content2(fullname2,i_is_html)
                                            a2 = a[0]
                                            #date_weekly1 = a2[40:48]
                                            if 'F' in a[1]:
                                                item3_ut_aging[model] = a[1]
                                        else:
                                            same_aging_modelname.append(model)
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.ut_h.content2(fullname2,i_is_html)
                                            a2 = a[0]
                                            #date_weekly1 = a2[10:18]
                                            item3_ut_aging[model] = a[1]
                                    else:
                                        if 'daily' in i_is_html:
                                            if model in same_daily_modelname:
                                                print("??model3???1y")
                                                fullname2 =  os.path.join(path__1,i_is_html)
                                                a = self.ut_h.content2(fullname2,i_is_html)
                                                a2 = a[0]
                                                date_weekly1 = a2[10:18]
                                                if 'F' in a[1]:
                                                    item1_ut_daily[model] = a[1]
                                                if a[1] == 'E':
                                                    item1_ut_daily_result_pass = 0
                                                    item1_ut_daily_result_fail = 0  
                                                    ut_usecase_count[model] = item1_ut_daily_result_pass,item1_ut_daily_result_fail
                                                else:
                                                    item1_ut_result = a[3]
                                                    #print('11111111111item1_st_daily_result_list:',item1_st_daily_result)
                                                    item1_ut_result_list = item1_ut_result.split('/')
                                                    item1_ut_result_pass = int(item1_ut_result_list[1])
                                                    item1_ut_result_fail = int(item1_ut_result_list[2])
                                                    all_count =  list(ut_usecase_count[model])
                                                    #fail pass ??êy?a?à′?à??ó
                                                    all_count[0] = all_count[0] + item1_ut_result_pass
                                                    all_count[1] = all_count[1] + item1_ut_result_fail
                                                    ut_usecase_count[model] = tuple(all_count)
                                                
                                            else:
                                                same_daily_modelname.append(model)
                                                fullname2 =  os.path.join(path__1,i_is_html)
                                                a = self.ut_h.content2(fullname2,i_is_html)
                                                a2 = a[0]
                                                date_weekly1 = a2[10:18]
                                                item1_ut_daily[model] = a[1] 
                                                print('1!!!!!!!!!',a[1]) 
                                                if a[1] == 'E':
                                                    item1_ut_result_pass = 0
                                                    item1_ut_result_fail = 0  
                                                    ut_usecase_count[model] = item1_ut_result_pass,item1_ut_result_fail
                                                else:
                                                    item1_ut_result = a[3]
                                                    item1_ut_result_list = item1_ut_result.split('/')
                                                    item1_ut_result_pass = int(item1_ut_result_list[1])
                                                    item1_ut_result_fail = int(item1_ut_result_list[2])  
                                                    ut_usecase_count[model] = item1_ut_result_pass,item1_ut_result_fail 
                                                                    
                                        print("4",item1_ut_daily)
                                        
                            item1_unit = list(item1_ut_daily.values())
                            item2_unit = list(item2_ut_weekly.values()) 
                            #??′???è?íêí?ò3?ùDè?úèY??oóDèòa???? MyHTMLParser.items ?Dμ??úèY
                            MyHTMLParser.items = []
                            #′|àíweekly￡?è????ù?μ
                            if not item2_unit:
                                pass
                            else:
                                #è?1?weeklyê??úμ±ìì?′DDμ±ìì?áê?
                                if date_weekly == date_weekly1:
                                    pass
                                else:
                                    if date_weekly == '':
                                        print("??óDweeklyêy?Y")
                                    else:
                                        l = len(item2_unit)
                                        weekly_set[model,date_weekly,l] = item2_unit[l-1]     
                        else:
                            pass
                print("6666666666666666666666666666666666666666666")
                today_date_ut = str(datetime.datetime.now())
                concrete_today_date_ut = today_date_ut[2:10]
                print(concrete_today_date_ut)
                print(i_day1)
                if  i_day1 == concrete_today_date_ut:
                    print(ut_usecase_count)
                    for model_volumn_name in ut_usecase_count.keys():
                        model_volumn_name1 = model_volumn_name[0]
                        usecase_status = ut_usecase_count[model_volumn_name]
                        p = usecase_status[0]
                        f = usecase_status[1]
                        model_list_ut = self.db_ut.select3(self.defact_statistics_test1)
                        print(model_list_ut)
                        if model_volumn_name in model_list_ut:
                            pass
                        else:
                            self.db_ut.insert(self.defact_statistics_test1,'model',repr(model_volumn_name1))

                        self.db_ut.update2(self.defact_statistics_test1,repr(p),repr(f),repr(model_volumn_name1))
                else:
                    print("bugaizhetian")
                print(today_date_ut,i_day1)
                #2?è?o?óD'weekly'μ?êy?Y
                for e in weekly_set.keys():
                    i_day_part = i_day1[6:8]
                    if i_day_part in e[1]:
                        if item2_ut_weekly[e[0]] == 'F':
                            item1_ut_daily[e[0]] ='F'
                        else:
                            pass
                print("item1_ut_daily:",item1_ut_daily)
                print("item2_ut_weekly:",item2_ut_weekly)
                for s in item3_ut_aging.keys():
                    if s in item1_ut_daily.keys():
                        str_item1_ut_daily = item1_ut_daily[s]
                        str_item3_ut_aging = item3_ut_aging[s]
                        item1_ut_daily[s] = str_item1_ut_daily[0:2]+str_item3_ut_aging[0]
                        print(item1_st_daily[s])
                print("item1_ut_daily:",item1_ut_daily)
                item1_unit = list(item1_ut_daily.values())
                print(item1_unit)
                for col in item1_ut_daily.keys():
                    item_modelname.append(col[0])
                print(item_modelname)
                for e,t in zip(item1_unit,item_modelname):
                    self.db_ut .update1(self.ut_chart,column_name_[column_count_],repr(e),repr(t))
                column_count_=column_count_+1         
            
            #???t??????óD?aò?ìì
            else:
                item1_unit_1 = []
                item1_unit_1_copy = ['']
                print(weekly_set)
                if not weekly_set:
                    result = self.db_ut .select(column_name_[column_count_],self.ut_chart)
                    print(result)
                    if not result:
                        item2 = ''
                        tm= self.id_statistics_1(self.ut_chart)
                        for i in range(1,tm+1):
                            self.db_ut .update(self.ut_chart,column_name_[column_count_],repr(item2),i)
                            
                    else:
                        print("??ììò??-óDêy?Y")
                    column_count_=column_count_+1
                else:
                    tm1= self.id_statistics_1(self.ut_chart)
                    for element in range(0,tm1):
                        item1_unit_1.append('')
                    for e in weekly_set.keys():
                        e1 = str(e)
                        if i_day1 in e1:
                            number = int(e1[13])
                            value = weekly_set[i_day1,number]
                            if value == 'F':
                                item1_unit_1[number-1] = value
                            else:
                                continue
                if item1_unit_1 == item1_unit_1_copy:
                    result = self.db_ut .select(column_name_[column_count_],self.ut_chart)
                    if not result:
                        item2 = ''
                        tm2= self.id_statistics_1(self.ut_chart)
                        for i in range(1,tm2+1): 
                            self.db_ut .update(self.ut_chart,column_name_[column_count_],repr(item2),i)   
                    else:
                        print("??ììò??-óDêy?Y")
                    column_count_=column_count_+1
                    #print("??óD?aò?ìì")
                else:
                    if not item1_unit_1:
                        continue
                    else:
                        tm3= self.id_statistics_1(self.ut_chart)
                        for element1,i in zip(item1_unit_1,range(1,tm3+1)):
                            self.db_ut .update(self.ut_chart,column_name_[column_count_],repr(element1),i)
                        column_count_=column_count_+1
        
    def daily_ut_twoweeks(self,day_twoweeks,all_filename,path_root):
        self.db_ut .truncate(self.cat_ut_chart)
        column_name = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon1','Tue1','Wed1','Thu1','Fri1','Sat1','Sun1']
        column_count = 0
        #?òst±í?D2?è?model??
        for i_day3 in day_twoweeks:
            item = []
            #???t?????DóD?aò?ìì
            if i_day3 in all_filename:
                #??è?model??3?
                item_1 = self.ut_m.models1(path_root,i_day3)
                item = self.ut_m.model_member(item_1,item)
                #?ò±í?D2?è?model
                self.db_ut .model_column(self.cat_ut_chart,item)
            else:
                continue
        #st±í?￡?é
        for i_day in day_twoweeks:
            item = []
            item_modelname = []
            
            #???t?????DóD?aò?ìì
            if i_day in all_filename:
                print('1',i_day)
                #??è?model??3?
                item_1 = self.ut_m.models1(path_root,i_day)
                item = self.ut_m.model_member(item_1,item)
                #??è???ìì?·????μ??ùóD???t??3?
                path__1 = os.path.join(path_root,i_day)
                filelist = os.listdir(path__1)
                item1_ut = []
                item1_st_daily = {}
                same_daily_modelname = []
               
                #±éàúhtml???t??3??°?úèY
                for i_is_html in filelist:
                    print(i_is_html)
                    #?D??·?o?òa?óμ????t??3?￡?2￠·??ê?ùDèD??￠
                    if '.html' in i_is_html:
                        if 'unit' in i_is_html:
                            model_name = Modelname(host,user,pswd,database)
                            model = model_name.Modelname_handle(i_is_html)
                            #2é?ˉweekly?úèY
                            if 'weekly' in i_is_html:
                                pass
                            else:
                                if 'pilot' in i_is_html:
                                    print("2?1ü")    
                                else:
                                    if 'daily' in i_is_html:
                                        
                                        if model in same_daily_modelname:
                                            print("??model3???1y")
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.ut_h.content1(fullname2,i_is_html)
                                            a2 = a[0]
                                            date_weekly1 = a2[10:18]
                                            if 'F' in a[1]:
                                                item1_st_daily[model] = a[1]
                                        else:
                                            same_daily_modelname.append(model)
                                            fullname2 =  os.path.join(path__1,i_is_html)
                                            a = self.ut_h.content1(fullname2,i_is_html)
                                            a2 = a[0]
                                            date_weekly1 = a2[10:18]
                                            item1_st_daily[model] = a[1]                              
                                        print("item1_st_daily:",item1_st_daily)
                                    else:
                                        #′|àíaging?úèY
                                        if 'aging' in i_is_html:
                                            pass
                        else:
                            pass

                        item1_ut = list(item1_st_daily.values())
                        #??′???è?íêí?ò3?ùDè?úèY??oóDèòa???? MyHTMLParser.items ?Dμ??úèY
                        MyHTMLParser.items = []
                for col in item1_st_daily.keys():
                    item_modelname.append(col[0])
                for e,t in zip(item1_ut,item_modelname):
                    self.db_ut .update1(self.cat_ut_chart,column_name[column_count],repr(e[0]),repr(t))
               
                column_count=column_count+1
                
            #???t??????óD?aò?ìì
            else:
                tm1 = self.id_statistics_1(self.cat_ut_chart)
                item = ''
                for i in range(1,tm1+1):
                    self.db_ut.update(self.cat_ut_chart,column_name[column_count],repr(item),i)
                column_count = column_count+1    
    def daily_ut(self,item_1,path_root_next,day_oneweek):
        for i_unit in item_1:
            print("?￡?é??3?")
            print(i_unit)
    
            path = os.path.join(path_root_next,i_unit)
            file_list=os.listdir(path) #??è????¨μ?????
            item4_unit = []
            for k_unit in day_oneweek:
                print(k_unit)
                if k_unit in file_list:
    
                    print("???t?D?DóD?aò?ììμ?êy?Y")
                    for filename in os.listdir(path):
    
                        if filename==k_unit:
                                #???ˉμ??·
                            fullname = os.path.join(path,filename)
                            #??è???ì??3ò?ìì??????μ????táD±í
                            file_list1 = os.listdir(fullname)
    
                            if not file_list1:
                                item4_unit.append('')
                            else:
                                s_unit = 0
                                item2 = []
                                item1_unit = []
                                #?ù?Y???t??2?í???2?í¨μ?±í?D2?è?êy?Y
                                for k1_unit in file_list1:                                
                                    if 'unit' in k1_unit:
                                        s_unit = s_unit+1
                                        fullname1 = os.path.join(fullname,k1_unit)  
                                        #??è?í?ò3?′??  
                                        cn = Html_content()
                                        item1_unit.append(cn.content(fullname1))
                                        print(item1_unit)                                    
                                        if s_unit>1:
                                            if len(item1_unit)>1:
                                                for i_2_unit in item1_unit:
                                                    if i_2_unit == 'F':
                                                        item1_unit = ['F']
                                                        item4_unit.pop()
                                                        item4_unit.append(item1_unit[0])
                                        else:
                                            item4_unit.append(item1_unit[0])
                                    else:
                                        continue
                else:
                    print("???t?D?D??óD?aò?ììμ?êy?Y")
                    item4_unit.append('')
            result4 = self.db_ut .select3(self.ut_chart)
            print(result4)
            item5_ut = []
            i_ut_1 = "("+"'"+i_unit+"'"+","+")"
            print(i_ut_1)
            i_ut_2 = eval(i_ut_1)
            if i_ut_2 in result4:
                print("??modelò??-óD?μ")
                r = self.db_ut .select4(self.ut_chart,repr(i_unit))
                print("SSSSSSSSSSSSSSS")
                print(r)
                r1= []
                b = list(r)
                print(list(b[0]))
                for i in list(b[0]):
                    if i is None:
                        r1.append("")
                    else:
                        r1.append(i)
                print(r1)
                new = []
                for i,i1 in zip(range(2,len(list(r1))),item4_unit):
                    c=list(r1)
                    if i1 =='':
                        new.append(c[i])
                    else:
                        if i1 == 'F':
                            d = c[i]
                            d = i1+d[1:3]
                            new.append(d)
                        else:
                            if i1 =='C':
                                d = c[i]
                                d = i1+d[1:3]
                                new.append(d) 
                            else:
                                new.append(c[i])
                print(new)
                if len(new) <7:
                    count =  7 - len(new)
                    for i_1_ut in range(0,count):
                        new.append('')
                print(new)
                i1 = new[0]
                i2 = new[1]
                i3 = new[2]
                i4 = new[3]
                i5 = new[4]
                i6 = new[5]
                i7 = new[6]
                self.db_ut .update_daily(self.ut_chart,repr(i1),repr(i2),repr(i3),repr(i4),repr(i5),repr(i6),repr(i7),repr(i_unit))
            else:
                self.db_ut .insert(self.ut_chart,'model',repr(i_unit))
                for ii1 in item4_unit:
                    if ii1 == '':
                        item5_ut.append("")
                    else:
                        item5_ut.append(ii1)
                if len(item5_ut) <7:
                    count =  7 - len(item5_ut)
                    for i_1_ut in range(0,count):
                        item5_ut.append('')
                print(item5_ut)
                
                i1 = item5_ut[0]
                i2 = item5_ut[1]
                i3 = item5_ut[2]
                i4 = item5_ut[3]
                i5 = item5_ut[4]
                i6 = item5_ut[5]
                i7 = item5_ut[6]
                self.db_ut .update_daily(self.ut_chart,repr(i1),repr(i2),repr(i3),repr(i4),repr(i5),repr(i6),repr(i7),repr(i_unit))
        tm_1= self.id_statistics_1(self.ut_chart) 
        for i in range(1,tm_1+1):
            r = self.db_ut .select6(self.ut_chart,i)
            n = 0
            r1 = r[0]
            r2 = list(r1)
            print(r2)
            for iii in r2:
                if iii == None:
                    n = n+1
                    print(r2,n)
                    if n == 7:
                        self.db_ut .delete1(self.ut_chart,i)
                else:
                    if iii == '':
                        n = n +1
                        print(r2,n)
                        if n == 7:
                            self.db_ut .delete1(self.ut_chart,i)
                            
        self.db_ut.alter(self.ut_chart)
        self.ut_m.modify_modelname(self.ut_chart)
        self.ut_m.modify_modelname(self.cat_ut_chart)
        self.ut_m.modify_modelname(self.defact_statistics_test1)
       
        

class Copy_file:
    def Host_environment(self,hostname,port,username,password,local_dir,remote_dir):
        t=paramiko.Transport((hostname,port))
        t.connect(username=username,password=password)
        sftp = paramiko.SFTPClient.from_transport(t)
        files_remote = sftp.listdir(remote_dir) #?aà?Dèòa×￠òa￡?áD3???3ì???t±?D?ê1ó?sftp￡???2??üó?os
        
        count_not_daily = 0
        for n in files_remote:
            count_not_daily = count_not_daily + 1
        
        files_local =  os.listdir(local_dir)
        
        count_daily = 0
        for d_name in files_remote:
            local1_dir = os.path.join(local_dir,d_name)+'/'
            #?D????????ê?·?′??ú
            result = os.path.exists(local1_dir)
            if result == False:
                os.mkdir(local1_dir)
            else:
                pass
            #?????á11±?D??a/home/sunlanzi/all2/àà??2??á??DD2ù×÷
            remote1_dir = os.path.join(remote_dir,d_name)+'/' 
            localcount_d_name_files = 0
            remotecount_d_name_files = 0
            if '-' in d_name:
                print(d_name)
                if d_name in files_local:
                    
                    files_loacal_11 = os.listdir(local1_dir)
                    for i in files_loacal_11:
                        localcount_d_name_files = localcount_d_name_files + 1
                    files_remote_11 = sftp.listdir(remote1_dir)
                    for j in files_remote_11:
                        remotecount_d_name_files = remotecount_d_name_files + 1
                    if remotecount_d_name_files == localcount_d_name_files:
                        pass
                    else:
                        for i_file in files_remote_11:
                            if i_file in files_loacal_11:
                                pass
                            else:
                                p = os.path.join(remote1_dir,i_file)
                                print(p)
                                result = os.path.isdir(p)
                                print(result)
                                try:
                                    if result == False:
                                        print(i_file)
                                        sftp.get(os.path.join(remote1_dir,i_file),os.path.join(local1_dir,i_file)) #×￠òa￡?′?′|???ü??±′μ?ê??3????ì?μ????t￡???2??üê?????
                                except:
                                    print("hahah")
                    
                    pass
                    
                else:
                    files_remote1 = sftp.listdir(remote1_dir)
                    for file in files_remote1:
                        
                        p = os.path.join(remote1_dir,file)
                        print(p)
                        result = os.path.isdir(p)
                        print(result)
                        try:
                            if result == False:
                                print(file)
                                sftp.get(os.path.join(remote1_dir,file),os.path.join(local1_dir,file)) #×￠òa￡?′?′|???ü??±′μ?ê??3????ì?μ????t￡???2??üê?????
                        except:
                            print("hahah")
                
            else:
                if d_name == 'daily':
                    files_remote2 = sftp.listdir(remote1_dir)
                
                    for file in files_remote2:
                        remote2_dir = os.path.join(remote1_dir,file)+'/'
                    
                        if '.sh' in file:
                            continue
                        else:
                            files_remote3 = sftp.listdir(os.path.join(remote1_dir,file))
                            for i in files_remote3:
                                count_daily = count_daily+1
                        
                    
                        local2_dir = os.path.join(local1_dir,file)+'/'
                        files_local1 = os.listdir(local2_dir)
                        print("@@",file)
                        for item in files_remote3:
                        
                            if item in files_local1:
                                continue
                            else:
                                if '18' in item:
                                    local3_dir = os.path.join(local2_dir,item)+'/'
                                    os.mkdir(local3_dir)
                                    remote3_dir = os.path.join(remote2_dir,item)+'/'
                                    print(remote3_dir)
                                    files_remote4 = sftp.listdir(remote3_dir)
                                    for file1 in files_remote4:
                                        sftp.get(os.path.join(remote3_dir,file1),os.path.join(local3_dir,file1))
                                else:
                                    print(item)
                                    print(os.path.islink(os.path.join(remote2_dir,item)))
                                    sftp.get(os.path.join(remote2_dir,item),os.path.join(local2_dir,item))
        return count_not_daily,count_daily 
        
        
        
class JiraIssue(object):
    def __init__(self,host,user,pswd,database,table_name3):
        self.db_Jira = DataToMysql(host,user,pswd,database)
        self.Jira_table = table_name3
    #print issue summary
    def get_issue(self, url, user, pswd, prjname):
        issue_priority = {}
        print(url,user,pswd)
        jira = JIRA(url, basic_auth=(user, pswd))
        issues = jira.search_issues('project = "'+prjname+'" and issuetype="Bug" and status!="Closed"', maxResults=0, fields='summary,priority,status')
        for issue in issues:
            if issue_priority.has_key(issue.fields.priority.name):
                issue_priority[issue.fields.priority.name] = issue_priority[issue.fields.priority.name] + 1
            else:
                issue_priority[issue.fields.priority.name] = 1
        return issue_priority
    def insert_issue(self,host,user,pswd,prjlist):
        self.db_Jira.truncate(self.Jira_table)
        for prj in prjlist:
            issue_data = self.get_issue(host, user, pswd, prj)
            keys = "project"
            values = '"' + prj + '"'
            for issue in issue_data:
                keys = keys + "," + issue
                values = values + "," + str(issue_data[issue])
            result = self.db_Jira.insert(self.Jira_table,keys,values)
            
            
class getGerrit(object):
    def __init__(self,host,user,pswd,database,modification_chart):
        self.db_getGerrit = DataToMysql(host,user,pswd,database)
        self.modification_chart = modification_chart
    def getgerrit(self,day_twoweeks):
        self.db_getGerrit.truncate(self.modification_chart)
        gerrit_column_name = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun','Mon1','Tue1','Wed1','Thu1','Fri1','Sat1','Sun1']
        #self.db_getGerrit.truncate(self.modification_chart)
        print('daylist:',day_twoweeks)
        prj_count = {}        
        auth = HTTPDigestAuth('chao.wee', 'Mmnftd5xrVmCXSQ3l5SKPlrhkHhAt7jeZxAN+y8U2Q')
        rest = GerritRestAPI(url='http://105.128.30.58:8082', auth=auth)
        
        changes = rest.get("/changes/?q=after:" + day_twoweeks[0])
        for change in changes:
            nLines = change['deletions'] + change['insertions']
            prj = change['updated'][5:10] + ":" + change['project']
            if prj in prj_count.keys():
                prj_count[prj] = prj_count[prj] + nLines
            else:
                prj_count[prj] = nLines
        print(prj_count)
        for date in day_twoweeks:
            date_1 = date[3:8]
            self.db_getGerrit.insert(self.modification_chart,'date',repr(date_1))
        for item in prj_count:
            subitem = item.split(":")
            print(subitem[1])
            project_name = '`' + subitem[1] + '`'
            #project_name = CONCAT(['`',subitem[1],'`'])
            print(project_name)
            result = self.db_getGerrit.select_is_exist_columnname(repr(subitem[1].encode('ascii')),repr(self.modification_chart))
            print('result:',result)
            if not result:
                self.db_getGerrit.alter_column_title(self.modification_chart,project_name)
            else:
                pass
            result_date = self.db_getGerrit.select5('date',self.modification_chart)
            print('result_date:',result_date)
            for d in result_date:
                if subitem[0] == d[0]:
                    self.db_getGerrit.update_specify_location(self.modification_chart,project_name,prj_count[item],'date',repr(d[0]))
                else:
                    #self.db_getGerrit.update_specify_location(self.modification_chart,project_name,0,'date',repr(d[0]))
                    pass
            '''
            if date in day_twoweeks:
                project_list = self.db_getGerrit.select7(self.modification_chart)
                #print(project_list)
                subitem_1 = "("+"'"+subitem[1]+"'"+","+")"
                #print(subitem_1)
                subitem_2 = eval(subitem_1)
                #print('subitem_2:',subitem_2)
                
                if subitem_2 in project_list:
                    pass
                else:
                    self.db_getGerrit.insert(self.modification_chart,'project',repr(subitem[1].encode('ascii')))
                pos = day_twoweeks.index(date)
                print('the position is:',pos)
                self.db_getGerrit.update4(self.modification_chart, gerrit_column_name[pos],prj_count[item],repr(subitem[1].encode('ascii')))
            else:
                pass
            '''
                
          
class Main_process:
    def execute(self): 
        print("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
        print(datetime.datetime.now())
        
        hostname = '105.128.30.59'
        username = 'root'
        password = 'auto!@#'
        port = 22
        local_dir = r'/home/artik/software/dashboard/DataCollection/all2/'
        remote_dir = r'/var/www/artik-release/images/Fileshare/CI/'
        c = Copy_file()
        count=c.Host_environment(hostname,port,username,password,local_dir,remote_dir)
        count1 = count[0]
        count2 = count[1]
        print(count1,count2)
        
        #??è??ùóDmodel??
        root_directory_name = 'daily' 
        m = Modelname(host,user,pswd,database)
        item_1 = m.models(path_root,root_directory_name)
        #??è?á???D??úè??ú?ò??ò???D??úè??ú
        Day = days_count()
        Day1 = Day.two_or_one_week()
        day_twoweeks = Day1[0]
        day_oneweek = Day1[1]
        #daylist = Day1[2]
        
        GETgerrit = getGerrit(host,user,pswd,database,'dashboard_cat_code_modification_chart')
        GETgerrit.getgerrit(day_twoweeks)
        
        path_root_next = os.path.join(path_root,root_directory_name)
        ##item1_unit = []
        ##item1_st = []
        insert_data_st = ST_table('dashboard_ci_st_chart1','dashboard_cat_ci_daily_chart','dashboard_cat_ci_weekly_chart','dashboard_cat_ci_aging_chart','dashboard_cat_ci_daily_detail_chart','dashboard_cat_ci_weekly_detail_chart','dashboard_cat_ci_aging_detail_chart',host,user,pswd,database)
        insert_data_ut = UT_table('dashboard_ci_ut_chart1','dashboard_cat_ci_ut_chart','dashboard_cat_ci_ut_detail_chart',host,user,pswd,database)
        insert_data_st.not_daily_st(day_twoweeks,all_filename,path_root)
        insert_data_st.daily_st(item_1,path_root_next,day_twoweeks)
        
    
        insert_data_ut.not_daily_ut(day_oneweek,all_filename,path_root)
        
        insert_data_ut.daily_ut_twoweeks(day_twoweeks,all_filename,path_root)
        insert_data_ut.daily_ut(item_1,path_root_next,day_oneweek)
        
        '''
        ji = JiraIssue(host,user,pswd,database,'dashboard_cat_st_severity_chart')
        prjlist = ["ARTIK E2E", "ARTIK IoT", "ARTIK E2E IDE"]
        ji.insert_issue("http://105.128.30.62:8080", "chao.wee", "13647408", prjlist)
        '''
        
        global timer
        timer = threading.Timer(600.0, Process.execute)
        timer.start()
        

if __name__ == '__main__':
    path_root = r'/home/artik/software/dashboard/DataCollection/all2/'
    #path_root = r'C:\Users\sunlanzi\Desktop\all2-1'
    all_filename = os.listdir(path_root)
    

    host = '109.105.120.34'
    user = 'root'
    pswd = 'auto!@#'
    database = 'dashboard'
    
    Process = Main_process()
    timer = threading.Timer(1.0, Process.execute)
    timer.start()
    
