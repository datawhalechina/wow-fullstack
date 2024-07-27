from flask import Blueprint, render_template, request, jsonify, send_from_directory, redirect,url_for
from flask_login import login_required, current_user
from importlib import reload
import os
import sys
sys.path.append(os.path.abspath('./apps/jc'))
import jcmodel
import json



jc = Blueprint('jc',__name__,template_folder='./templates', static_folder="./static")
@jc.route('/')
@login_required
def jc_index():
	return render_template("jiaocheng.html")

# 小程序相关接口

@jc.route('/fetchqueses/', methods=['POST'])
def fetchqueses():
    reload(jcmodel)
    rstdic = jcmodel.fetch_queses(request)
    return json.dumps(rstdic)

@jc.route('/fetchpapers/', methods=['POST'])
def fetchpapers():
    reload(jcmodel)
    rstdic = jcmodel.fetchpapers(request)
    return json.dumps(rstdic)