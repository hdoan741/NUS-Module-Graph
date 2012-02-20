# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/topics/item-pipeline.html

from pymongo import Connection

from soc_crawler import parser

connection = Connection('localhost', 27017)
db = connection.ModuleDatabase
db['modules'].remove({})

class SocCrawlerPipeline(object):
    def process_item(self, item, spider):
        moduleCode = item['code']
        prerequisites = item['prerequisites']
        preclusions = item['preclusions']
        item['prereq'] = parser.getModulePrerequisite(moduleCode, prerequisites)
        item['preexc'] = parser.getModulePreclusion(moduleCode, preclusions)
        db['modules'].insert(dict(item))
        return item
