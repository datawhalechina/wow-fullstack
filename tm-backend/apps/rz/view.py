from flask import Blueprint, render_template, request, jsonify, send_from_directory, redirect,url_for
from flask_login import login_required, current_user



rz = Blueprint('rz',__name__,template_folder='./templates', static_folder="./static")
@rz.route('/')
@login_required
def rz_index():
	return render_template("renzheng.html")
