try:
    import simplejson as json
except ImportError:
    import json

import re
import urllib

MODULE_CODE_REGEX = "[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,2}"
YEAR_REGEX = "AY[0-9]{4}"
# PASS_MC = "[0-9]+ MCs"
REQUISITE_LOGIC = MODULE_CODE_REGEX + '|[()\[\]\{\}]|and|or|'# + PASS_MC
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
        elif re.match(MODULE_CODE_REGEX, items[i]): #  or re.match(PASS_MC, items[i]):
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

def removeFalsePositive(matches):
    filtered = []
    for match in matches:
        # remove AY****
        if not re.match(YEAR_REGEX, match):
            filtered.append(match)
    return filtered

def getModulePrerequisite(moduleCode, prerequisite):
    # Rip-off unnecessary characters
    matches = re.findall(REQUISITE_LOGIC, prerequisite)
    if moduleCode in matches:
        matches.remove(moduleCode)
    matches = removeFalsePositive(matches)
    req = buildPrerequisite(matches)
    # Parse the logic
    return req

# Parse module preclusions
def getModulePreclusion(moduleCode, preclusion):
    matches = re.findall(MODULE_CODE_REGEX, preclusion)
    if moduleCode in matches:
        matches.remove(moduleCode)
    matches = removeFalsePositive(matches)
    return matches
