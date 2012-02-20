import re
import collections

from scrapy.spider import BaseSpider
from scrapy.selector import HtmlXPathSelector

from scrapy.contrib.spiders import CrawlSpider, Rule
from scrapy.contrib.linkextractors.sgml import SgmlLinkExtractor

from soc_crawler.items import ModuleItem

def process_value(value):
    m = re.search("javascript:popup\('(.*?)'", value)
    if m:
        return m.group(1)

def module_link_process(value):
    matches = re.findall(MODULE_CODE_REGEX, value)

class SocSpider(CrawlSpider):
    name = "soc_modules"
    allowed_domains = ["nus.edu.sg"]
    start_urls = [
            "http://www.comp.nus.edu.sg/undergraduates/useful_course_schedule.html"
    ]

    rules = (
            Rule(SgmlLinkExtractor(allow=('msearch_view\.aspx', ),
                                   unique=True,
                                   process_value=process_value),
                callback='parse_module'),
            )

    def parse_module(self, response):
        hxs = HtmlXPathSelector(response)
        module = hxs.select("id('viewtbl')")

        module_info = collections.defaultdict(lambda: '')
        for row in module.select("tr"):
            title = row.select("td[position()=1]/font/b/text()").extract()
            content = row.select("td[position()=2]/font/text()").extract()
            module_info[title[0]] = content[0]

        item = ModuleItem()
        item['code'] = module_info['Module Code']
        item['name'] = module_info['Module Title']
        item['desc'] = module_info['Description']
        item['mc'] = module_info['Module Credit']
        item['workload'] = module_info['Workload']
        item['prerequisites'] = module_info['Prerequisites']
        item['preclusions'] = module_info['Preclusions']
        item['crosslisting'] = module_info['Cross-listing']

        return item
