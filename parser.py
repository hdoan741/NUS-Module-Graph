
import re
import json
import urllib

MODULE_CODE_REGEX = "[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,2}"
PASS_MC = "[0-9]+ MCs"
REQUISITE_LOGIC = MODULE_CODE_REGEX + '|[()\[\]\{\}]|and|or|' + PASS_MC
BRACKETS = ['(', '[', '{']
CLOSING_BRACKET = {
        '(': ')',
        '[': ']',
        '{': '}'
        }
# Parse module prerequisite

def buildPrerequisite(items):
    req = []
    i = 0
    n = len(items)
    isOrList = False
    while i < n:
        if items[i] in BRACKETS:
            j = i + 1
            while j < n and items[j] != CLOSING_BRACKET[items[i]]:
                j += 1
            sub_list = buildPrerequisite(items[i + 1 : j])
            req.append(sub_list)
            i = j
        elif re.match(MODULE_CODE_REGEX, items[i]) or re.match(PASS_MC, items[i]):
            req.append(items[i])
        elif items[i] == 'or':
            isOrList = True
        i += 1

    # Flagging the list correctly
    if isOrList:
        req.insert(0, 0)
    else:
        # By default it is an AND list
        req.insert(0, 1)

    return req

def getModulePrerequisite(code, prerequisite):
    # Rip-off unnecessary characters
    matches = re.findall(REQUISITE_LOGIC, prerequisite)
    req = buildPrerequisite(matches)
    # Parse the logic
    return req

# Parse module preclusions
def getModulePreclusion(code, preclusion):
    matches = re.findall(MODULE_CODE_REGEX, preclusion)
    return matches

def getModuleCode(lst):
    if type(lst) == list:
        for item in lst:
            getModuleCode(item)
    else:
        if re.match(MODULE_CODE_REGEX, str(lst)):
            all_modules.append(lst)

def crawlCurrentModules():
    url = urllib.urlopen('http://api.nushackers.org/modules/')
    data = url.read()
    f = open('modules_info', 'w')
    f.write(data)

def getModulesInfo():
    f = open('modules_info')
    modules_info = json.load(f)
    return modules_info

avail_modules = []
all_modules = []
# crawlCurrentModules()
modules_info = getModulesInfo()

for mod in modules_info:
    # print '-------------------'
    # print mod['code']
    moduleCode = mod['code']
    avail_modules.append(moduleCode)
    preclusions = getModulePreclusion(moduleCode, mod['preclusion'])
    prerequisites = getModulePrerequisite(moduleCode, mod['prerequisite'])
    getModuleCode(preclusions)
    getModuleCode(prerequisites)
    # print '  ', prerequisites
    # print '  ', preclusions


