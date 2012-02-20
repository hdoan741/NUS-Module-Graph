#!/usr/bin/env python
from flask import Flask, url_for, render_template, abort, Response
from flask import request
import gc
from pymongo import Connection
import pymongo
import re
try:
    import simplejson as json
except ImportError:
    import json

app = Flask(__name__)

# mongoDB connection
connection = Connection('localhost', 27017) # the default is 27017
db = connection.ModuleDatabase

errorjson = json.dumps({"message": "Not Found"})

MODULE_CODE_REGEX = "[A-Z]{2,3}[0-9]{3,4}[A-Z]{0,2}"

def getModuleCode(lst):
    moduleList = []
    if type(lst) == list:
        for item in lst:
            submods = getModuleCode(item)
            moduleList.extend(submods)
    else:
        if re.match(MODULE_CODE_REGEX, str(lst)):
            moduleList.append(lst)
    return moduleList

@app.route('/')
def get_home():
    return render_template('home.html')

@app.route('/modules/', methods=['GET'])
def get_all_modules():
    """Returns all the modules.
    """
    entities = db['modules'].find()
    if not entities:
        return Response(errorjson, mimetype='application/json')
    allModules = []
    desc = []
    for e in entities:
        module = {}
        module['code'] = e['code']
        module['req'] = e['prereq']
        module['exc'] = e['preexc']
        if module['code']:
            allModules.append(module['code'])
            allModules.extend(getModuleCode(module['req']))
            allModules.extend(getModuleCode(module['exc']))
            desc.append(module)
    allModuleList = list(set(allModules))
    response = {
        'listModule': allModuleList,
        'desc': desc
    }
    gc.collect()
    return Response(json.dumps(response), mimetype='application/json')

@app.route('/module/<moduleCode>', methods=['GET'])
def get_module(moduleCode):
    """Returns details for a specific module
        :params string moduleCode
    """
    entity = db['modules'].find_one({'code': moduleCode})
    if not entity:
        return Response(errorjson, mimetype='application/json')
    del entity['_id'] # the _id object isn't JSON serializable
    gc.collect()
    return Response(json.dumps(entity), mimetype='application/json')

@app.route('/search', methods=['GET'])
def search_modules():
    """Returns details for all modules that match given regex
       :params string regex
    """
    regex = request.args.get('term', '')
    print regex
    entities1 = db['modules'].find({'code': re.compile('%s'%regex, re.I)}) \
        .sort('code', pymongo.ASCENDING).limit(10)
    entities2 = db['modules'].find({'name': re.compile('%s'%regex, re.I)}) \
        .sort('code', pymongo.ASCENDING).limit(10)
    ls = []
    appeared = []
    for entities in [entities1, entities2]:
        for e in entities:
            if e['code'] not in appeared and len(ls) < 10:
                appeared.append(e['code'])
                title = e['code'] + ': ' + e['name']
                ls.append({
                    'label': title,
                    'value': e['code']
                    })
    gc.collect()
    return Response(json.dumps(ls), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
