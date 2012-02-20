# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/topics/items.html

from scrapy.item import Item, Field

class ModuleItem(Item):
    # define the fields for your item here like:
    # name = Field()
    code = Field()
    name = Field()
    desc = Field()
    mc = Field()
    workload = Field()
    prerequisites = Field()
    preclusions = Field()
    crosslisting = Field()
    prereq = Field()
    preexc = Field()
    pass
