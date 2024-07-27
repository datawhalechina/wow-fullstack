from flask import Flask,json
from apps.login.beknowmodels import *

appjc = Flask(__name__)
appjc.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
appjc.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(appjc)

def fetch_queses(req):
    testid = req.form.get("pid")
    with appjc.test_request_context():
        allquiz = []
        tp = Testpapers.query.filter_by(testpaperid=testid).first()
        rtn = {}
        rtn["testpaper_title"]=tp.testpaper_title
        rtn["testpaper_authorname"]=tp.testpaper_authorname
        rtn["ques_amount"]=tp.ques_amount
        rtn["answers"]=tp.answers
        return rtn
    

def fetchpapers(req):
    paperdata = []
    with appjc.test_request_context():
        tall = Testpapers.query.all()
        for tp in tall:
            pp = {}
            if tp.reviewed==5:
                pp['paperid'] = tp.testpaperid
                pp["papertitle"]=tp.testpaper_title
                pp["author"]="自塾"
                pp["num"]=tp.ques_amount
                paperdata.append(pp)
    return paperdata