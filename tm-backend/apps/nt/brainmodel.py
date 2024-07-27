import ast
import json
import xmind
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
import copy
def dayin():
    print("18点58分")


def savebrain(brain,deleted):
    braindict = json.loads(brain)
    dele = json.loads(deleted)
    arraydata = copy.deepcopy(braindict["data"])
    iddic = {}
    rootid = ""
    roottopic = ""
    for idic in arraydata:
        iddic[idic["id"]] = idic["topic"]
        if "isroot" in idic and idic["isroot"]==True:
            rootid = idic["id"]
            roottopic = idic["topic"]
    #iddic
    pardic = {}
    partopicdic = {}
    for i in range(len(arraydata)):
        arraydata[i]["graphid"] = rootid
        arraydata[i]["graphtopic"] = roottopic
        if "parentid" in arraydata[i]:
            if arraydata[i]["parentid"] not in pardic:
                pardic[arraydata[i]["parentid"]]=[]
                partopicdic[arraydata[i]["parentid"]]=[]
            pardic[arraydata[i]["parentid"]].append(arraydata[i]["id"])
            partopicdic[arraydata[i]["parentid"]].append(arraydata[i]["topic"])
    for i in range(len(arraydata)):
        if "parentid" in arraydata[i]:
            arraydata[i]["parenttopic"] = iddic[arraydata[i]["parentid"]]
        if arraydata[i]["id"] in pardic:
            arraydata[i]["childrenid"] = pardic[arraydata[i]["id"]]
            arraydata[i]["childrentopic"] = partopicdic[arraydata[i]["id"]]
        else:
            arraydata[i]["childrenid"] = []
            arraydata[i]["childrentopic"] = []

    map_search = Brainmap.query.filter_by(root_id=rootid).first()
    if map_search:
        map_search.root_topic=roottopic
        map_search.mapdata=str(braindict)
        db.session.commit()
    else:
        mapdata = Brainmap(
            user_id=current_user.id,
            root_id=rootid,
            root_topic=roottopic,
            mapdata=str(braindict))
        db.session.add(mapdata)
        db.session.commit()

    saveobj = []
    for dictitem in arraydata:
        if "isroot" in dictitem:
            dictitem.pop("isroot")
        elif "expanded" in dictitem:
            dictitem.pop("expanded")
        item_search = Brainitem.query.filter_by(itemid=dictitem["id"]).first()
        if item_search:
            item_search.graphtopic=roottopic
            item_search.parentid=dictitem.get("parentid")
            item_search.parenttopic=dictitem.get("parenttopic")
            item_search.itemtopic=dictitem["topic"]
            item_search.childrenid=str(dictitem["childrenid"])
            item_search.childrentopic=str(dictitem["childrentopic"])
            db.session.commit()
        else:
            newitem = Brainitem(
                user_id=current_user.id,
                graphid=rootid,
                graphtopic=roottopic,
                parentid=dictitem.get("parentid"),
                parenttopic=dictitem.get("parenttopic"),
                itemid=dictitem["id"],
                itemtopic=dictitem["topic"],
                childrenid=str(dictitem["childrenid"]),
                childrentopic=str(dictitem["childrentopic"]))
            saveobj.append(newitem)
    db.session.add_all(saveobj)
    print("插入了")
    print(len(saveobj))
    for delitem in dele:
        item_search = Brainitem.query.filter_by(itemid=delitem).first()
        if item_search:
            db.session.delete(item_search)
    print("删除了")
    print(len(dele))
    db.session.commit()



    

    

def genJsmindByJson(parent,parentid, data):
    if data is None:
        print("json为空")
        return
    node = {}
    for key in data:
        node["parentid"]= parentid
        if key == 'title':
            node["topic"]=data['title']
        elif key == 'id':
            node["id"]=data['id']
        elif key == 'topic':
            node["topic"]=data['title']
        elif key == 'topics':
            if isinstance(data['topics'], dict):
                genJsmindByJson(parent,data['id'], data['topics'])
            elif isinstance(data['topics'], list):
                for i in range(len(data['topics'])):
                    genJsmindByJson(parent,data['id'], data['topics'][i])
            else:
                print("其它类型")
    parent.append(node)

def xmind2jsmind(content):
    arraydata = []
    parentid = None
    genJsmindByJson(arraydata, parentid, content[0]["topic"])
    for item in arraydata:
        if item["parentid"] == None:
            graph_id = item["id"]
            item["isroot"] = True
    for item in arraydata:
        item["graphid"] = graph_id
    genmindarray = {}
    genmindarray["meta"] = {"name":"example","author":"hizzgdev@163.com","version":"0.2"}
    genmindarray["format"] = "node_array"
    genmindarray["data"] = arraydata
    return genmindarray



def list_to_tree(datalist, roottopic, rootid):
    out = { 
        rootid: { 'id': rootid, 'parentid': rootid, 'title': roottopic, 'topics': [] }
    }

    for par in datalist:
        if 'parentid' in par:
            out.setdefault(par['parentid'], { 'topics': [] })
            out.setdefault(par['id'], { 'topics': [] })
            out[par['id']].update(par)
            out[par['parentid']]['topics'].append(out[par['id']])

    return out[rootid]


def genXmindByJson(parent, data):
    if data is None:
        return
    if data["id"]==data["parentid"]:
        node = parent
    else:
        node = parent.addSubTopic()
    for key in data:
        if key == 'title':
            node.setTitle(data['title'])
        elif key == 'link':
            node.setURLHyperlink(data['link'])
        elif key == 'labels':
            node.addLabel(data['labels'][0])
        elif key == 'topic':
            node.setTitle(data['title'])
        elif key == 'topics':
            if isinstance(data['topics'], dict):
                genXmindByJson(node, data['topics'])
            elif isinstance(data['topics'], list):
                for i in range(len(data['topics'])):
                    genXmindByJson(node, data['topics'][i])
            else:
                print("其它类型")



def genxmind(dataload, roottopic, rootid):
    convdata = []
    for i in range(len(dataload)):
        tempdic = {}
        if "parentid" in dataload[i]:
            tempdic["id"]=dataload[i]["id"]
            tempdic["parentid"]=dataload[i]["parentid"]
            tempdic["title"]=dataload[i]["topic"]
            convdata.append(tempdic)
            
    convtree = list_to_tree(convdata, roottopic, rootid)
    workbook = xmind.load("temp.xmind")
    sheet = workbook.getPrimarySheet()
    root = sheet.getRootTopic()
    root.setStructureClass = "org.xmind.ui.map.unbalanced"
    sheet.setTitle("画布1")
    genXmindByJson(root, convtree)
    xmind_path = './apps/nt/static/xmindfiles/'
    xmind.save(workbook, path=xmind_path + roottopic + '.xmind')



def searchbrainid(brainid):
    bm = Brainmap.query.filter_by(root_id=brainid).first()
    if bm:
        minddics = bm.mapdata
        minddict = ast.literal_eval(minddics)
        datajson = json.dumps(minddict['data'])
    else:
        datajson = False
    return datajson
    

def anaq(idlist,item):
    if len(idlist)>50:
        idlist.pop(0)
    idlist.append(item)
    print(idlist)
    
