from flask_sqlalchemy import SQLAlchemy
import datetime
import os
from datetime import timedelta
from dotenv import load_dotenv  
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()

# 加载.env文件  
load_dotenv()  

class Config(object):
    TEMPLATES_AUTO_RELOAD = True
    SEND_FILE_MAX_AGE_DEFAULT = timedelta(seconds=5)
    CSRF_ENABLED = True
    SECRET_KEY = 'guanguanjuju'
    UPLOAD_PATH = 'uploads/'
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URL_V1")
    SQLALCHEMY_POOL_RECYCLE = 10
    SQLALCHEMY_POOL_SIZE = 8000
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class Users(db.Model,UserMixin):
	__tablename__ = 'users'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	name = db.Column(db.String(32), nullable=False)
	gender = db.Column(db.String(32))
	gonghao = db.Column(db.Integer)
	bumen = db.Column(db.String(256))
	louceng = db.Column(db.String(32))
	role = db.Column(db.String(32))
	phone = db.Column(db.String(32))
	shenfen = db.Column(db.String(32))
	jiguan = db.Column(db.String(32))
	picnum = db.Column(db.Integer, default=0)
	xingzuo = db.Column(db.String(32))
	xueli = db.Column(db.String(32))
	xuexiao = db.Column(db.String(128))
	zhuanye = db.Column(db.String(128))
	aihao = db.Column(db.String(256))
	ziwo = db.Column(db.String(256))
	picpath = db.Column(db.String(128))
	register_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	avatar_path = db.Column(db.String(256), nullable=False, default='images/defaultpic.jpg')
	password_hash = db.Column(db.String(128)) # 密码散列值
	becoin = db.Column(db.Float, default=100.0)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)
	def set_password(self, password): # 用来设置密码的方法，接受密码参数
		self.password_hash = generate_password_hash(password) #将生成的密码保持到对应字段
	def validate_password(self, password): # 用于验证密码的方法，受密码作为参数
		return check_password_hash(self.password_hash, password)# 返回布尔值




class Projects(db.Model):
	__tablename__ = 'projects'
	projectid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	project_admin = db.Column(db.Integer, db.ForeignKey('users.id'))
	project_title = db.Column(db.String(256))
	project_desc = db.Column(db.TEXT)
	publish_time = db.Column(db.DateTime)
	deadline = db.Column(db.DateTime)
	pubvideo_url = db.Column(db.String(256))
	pubpic_url = db.Column(db.String(256))
	pubfile_url = db.Column(db.String(256))
	pubfile_name = db.Column(db.String(256))
	bonus = db.Column(db.Integer, default=0)
	process = db.Column(db.Integer, default=0)
	take_time = db.Column(db.DateTime)
	project_dealers = db.Column(db.String(256))
	finished = db.Column(db.Integer, default=0)
	finish_time = db.Column(db.DateTime)
	sln_desc = db.Column(db.TEXT)
	slnvideo_url = db.Column(db.String(256))
	slnpic_url = db.Column(db.String(256))
	slnfile_url = db.Column(db.String(256))
	slnfile_name = db.Column(db.String(256))
	decision = db.Column(db.String(32))
	hist_comments = db.Column(db.TEXT)
	curr_comments = db.Column(db.TEXT)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)
	secret = db.Column(db.Integer, default=0)


class Tasks(db.Model):
	__tablename__ = 'tasks'
	taskid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	project_id = db.Column(db.Integer, db.ForeignKey('projects.projectid'))
	task_type = db.Column(db.String(32))
	rel_quesid = db.Column(db.Integer)
	rel_codeid = db.Column(db.Integer)
	admin_name = db.Column(db.String(32))
	admin_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	task_title = db.Column(db.String(256))
	task_desc = db.Column(db.TEXT)
	task_repeat = db.Column(db.Integer, default=1)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	start_time = db.Column(db.DateTime)
	deadline = db.Column(db.DateTime)
	pubvideo_url = db.Column(db.String(256))
	pubpic_url = db.Column(db.String(256))
	pubfile_url = db.Column(db.String(256))
	pubfile_name = db.Column(db.String(256))
	bonus = db.Column(db.Integer, default=0)
	learn_courses = db.Column(db.String(256))
	learn_videos = db.Column(db.String(256))
	learn_papers = db.Column(db.String(256))
	learn_queses = db.Column(db.String(256))
	take_time = db.Column(db.DateTime)
	taker_name = db.Column(db.String(32))
	task_taker = db.Column(db.Integer, db.ForeignKey('users.id'))
	task_phase = db.Column(db.String(32))
	process = db.Column(db.Integer, default=0)
	currentnode = db.Column(db.String(32))
	lastnode = db.Column(db.String(256))
	nextnode = db.Column(db.String(256))
	submitted = db.Column(db.Integer, default=0)
	submit_time = db.Column(db.DateTime)
	finished = db.Column(db.Integer, default=0)
	finish_time = db.Column(db.DateTime)
	sln_desc = db.Column(db.TEXT)
	slnvideo_url = db.Column(db.String(256))
	slnpic_url = db.Column(db.String(256))
	slnfile_url = db.Column(db.String(256))
	slnfile_name = db.Column(db.String(256))
	decision = db.Column(db.String(32))
	hist_comments = db.Column(db.TEXT)
	curr_comments = db.Column(db.TEXT)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)
	secret = db.Column(db.Integer, default=0)

class Cocode(db.Model):
	__tablename__ = 'cocode'
	codeid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer)
	user_name = db.Column(db.String(32))
	task_id = db.Column(db.Integer)
	code_type = db.Column(db.String(32))
	lang = db.Column(db.String(32))
	code_desc = db.Column(db.TEXT)
	code1 = db.Column(db.TEXT)
	code2 = db.Column(db.TEXT)
	code3 = db.Column(db.TEXT)
	comments = db.Column(db.TEXT)
	reply = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	edit_time = db.Column(db.DateTime)
	submit_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Guanresult(db.Model):
	__tablename__ = 'guanresult'
	guanrstid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	player_name = db.Column(db.String(32), nullable=False)
	record_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	total_quiz = db.Column(db.Integer, default=0)
	bonus = db.Column(db.Integer, default=0)
	sumtime = db.Column(db.Float, default=0.0)


class Notice(db.Model):
	__tablename__ = 'notice'
	noticeid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	send_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	catigory = db.Column(db.String(32))
	send_text = db.Column(db.TEXT)
	read = db.Column(db.Integer, default=0)

class Folders(db.Model):
	__tablename__ = 'folders'
	folderid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	folder_title = db.Column(db.String(128))
	folder_desc = db.Column(db.String(256))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	demand = db.Column(db.String(128))
	item_num = db.Column(db.Integer, default=0)
	folder_seq = db.Column(db.Integer, default=0)
	perrecom_num = db.Column(db.Integer, default=0)
	sysrecom_num = db.Column(db.Integer, default=0)

class Favorites(db.Model):
	__tablename__ = 'favorites'
	favorid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	folder_id = db.Column(db.Integer, db.ForeignKey('folders.folderid'))
	target_type = db.Column(db.String(32))
	target_id = db.Column(db.Integer, default=0)
	target_title = db.Column(db.String(128))
	target_authorname = db.Column(db.String(32))
	target_authorid = db.Column(db.Integer, default=0)
	favor_seq = db.Column(db.Integer, default=0)
	comments = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())

class Becoinitems(db.Model):
	__tablename__ = 'becoinitems'
	itemid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	user_name = db.Column(db.String(32))
	user_type = db.Column(db.String(32))
	target_title = db.Column(db.String(256))
	target_type = db.Column(db.String(32))
	target_id = db.Column(db.Integer, default=0)
	oppo_type = db.Column(db.String(32))
	oppo_name = db.Column(db.String(32))
	oppo_id = db.Column(db.Integer, default=0)
	change = db.Column(db.Integer, default=0)
	amount = db.Column(db.Float, default=0.0)
	balance = db.Column(db.Float)
	comments = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Examination(db.Model):
	__tablename__ = 'examination'
	exaid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	candidate_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	target_type = db.Column(db.String(32))
	target_id = db.Column(db.Integer, default=0)
	target_stage = db.Column(db.String(32))
	middle_price = db.Column(db.Integer, default=0)
	scarcity = db.Column(db.Integer, default=0)
	progressiveness = db.Column(db.Integer, default=0)
	operability = db.Column(db.Integer, default=0)
	scomments = db.Column(db.TEXT)
	pcomments = db.Column(db.TEXT)
	ocomments = db.Column(db.TEXT)
	exa_comments = db.Column(db.TEXT)
	decision = db.Column(db.String(32))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)



class Videos(db.Model):
	__tablename__ = 'videos'
	videoid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	video_title = db.Column(db.String(256))
	video_desc = db.Column(db.TEXT)
	video_fulltext = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	modify_time = db.Column(db.DateTime)
	video_authorid = db.Column(db.Integer, db.ForeignKey('users.id'))
	investor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	video_ip = db.Column(db.String(32))
	video_class1 = db.Column(db.String(32))
	video_class2 = db.Column(db.String(32))
	video_class3 = db.Column(db.String(32))
	keywords = db.Column(db.String(256))
	video_length = db.Column(db.String(32))
	video_url = db.Column(db.String(256))
	zimu_url = db.Column(db.String(256))
	poster_url = db.Column(db.String(256))
	zan = db.Column(db.Integer, default=0)
	score = db.Column(db.Integer, default=0)
	viewed_num = db.Column(db.Integer, default=0)
	finish_times = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	init_price = db.Column(db.Integer, default=0)
	final_price = db.Column(db.Integer, default=0)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	exami_comments = db.Column(db.String(256))
	examinate_times = db.Column(db.Integer, default=0)
	scarcity = db.Column(db.Float, default=0.0)
	progressiveness = db.Column(db.Float, default=0.0)
	operability = db.Column(db.Float, default=0.0)
	reviewed = db.Column(db.Integer, default=0)
	reviewed_time = db.Column(db.DateTime)
	rel_ques = db.Column(db.String(256))
	rel_biwen = db.Column(db.String(256))
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Courselist(db.Model):
	__tablename__ = 'courselist'
	courseid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	course_title = db.Column(db.String(256))
	course_publisherid = db.Column(db.Integer, db.ForeignKey('users.id'))
	video_num = db.Column(db.Integer, default=0)
	whole_length = db.Column(db.String(32))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	modify_time = db.Column(db.DateTime)
	zan = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	did_time = db.Column(db.Integer, default=0)
	init_price = db.Column(db.Integer, default=0)
	final_price = db.Column(db.Integer, default=0)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	exami_comments = db.Column(db.String(256))
	reviewed = db.Column(db.Integer, default=0)
	reviewed_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

	rela_videos = db.relationship('Videos', secondary='videoitems', backref=db.backref('rela_courses', lazy='dynamic'))

videoitems = db.Table('videoitems',
	db.Column('videoitemid', db.Integer, primary_key=True, autoincrement=True),
	db.Column('courseid', db.Integer, db.ForeignKey('courselist.courseid')),
	db.Column('videoid', db.Integer, db.ForeignKey('videos.videoid')),
	db.Column('video_num', db.Integer, default=0),
	db.Column('show_title', db.String(256)),
	db.Column('course_part', db.String(256))
)



quizitems = db.Table('quizitems',
	db.Column('quizitemid', db.Integer, primary_key=True, autoincrement=True),
	db.Column('testpaperid', db.Integer, db.ForeignKey('testpapers.testpaperid')),
	db.Column('quesid', db.Integer, db.ForeignKey('questions.quesid')),
	db.Column('ques_num', db.Integer, default=0),
	db.Column('ques_value', db.Integer, default=0),
	db.Column('ques_part', db.String(256))
)


class Questions(db.Model):
	__tablename__ = 'questions'
	quesid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	ques_type = db.Column(db.String(32))
	ques_title = db.Column(db.String(256))
	ques_desc = db.Column(db.TEXT)
	descpic_url = db.Column(db.String(256))
	item_a = db.Column(db.String(256))
	item_b = db.Column(db.String(256))
	item_c = db.Column(db.String(256))
	item_d = db.Column(db.String(256))
	answer = db.Column(db.String(256))
	explain = db.Column(db.TEXT)
	explainpic_url = db.Column(db.String(256))
	ques_authorid = db.Column(db.Integer, db.ForeignKey('users.id'))
	ques_class1 = db.Column(db.String(32))
	ques_class2 = db.Column(db.String(32))
	ques_class3 = db.Column(db.String(32))
	keywords = db.Column(db.String(256))
	main_videoid = db.Column(db.Integer)
	rest_videoid = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	modify_time = db.Column(db.DateTime)
	zan = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	did_time = db.Column(db.Integer, default=0)
	wring_time = db.Column(db.Integer, default=0)
	init_price = db.Column(db.Integer, default=0)
	final_price = db.Column(db.Integer, default=0)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	exami_comments = db.Column(db.String(256))
	examinate_times = db.Column(db.Integer, default=0)
	scarcity = db.Column(db.Float, default=0.0)
	progressiveness = db.Column(db.Float, default=0.0)
	operability = db.Column(db.Float, default=0.0)
	rel_taskid = db.Column(db.Integer)
	rel_tuwenid = db.Column(db.Integer)
	reviewed = db.Column(db.Integer, default=0)
	reviewed_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Testpapers(db.Model):
	__tablename__ = 'testpapers'
	testpaperid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	testpaper_title = db.Column(db.String(256))
	testpaper_authorid = db.Column(db.Integer, db.ForeignKey('users.id'))
	testpaper_authorname = db.Column(db.String(32))
	ques_amount = db.Column(db.Integer, default=0)
	full_score = db.Column(db.Integer, default=0)
	answers = db.Column(db.TEXT)
	threshold = db.Column(db.Integer, default=80)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	modify_time = db.Column(db.DateTime)
	zan = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	did_time = db.Column(db.Integer, default=0)
	ava_score = db.Column(db.Float, default=0.0)
	init_price = db.Column(db.Integer, default=0)
	final_price = db.Column(db.Integer, default=0)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	exami_comments = db.Column(db.String(256))
	reviewed = db.Column(db.Integer, default=0)
	reviewed_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

	rela_queses = db.relationship('Questions', secondary='quizitems', backref=db.backref('rela_papers', lazy='dynamic'))


class Paperperform(db.Model):
	__tablename__ = 'paperperform'
	pperformid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	paper_id = db.Column(db.Integer, db.ForeignKey('testpapers.testpaperid'))
	start_time = db.Column(db.DateTime)
	finish_time = db.Column(db.DateTime)
	ques_amount = db.Column(db.Integer, default=0)
	jianda_amount = db.Column(db.Integer, default=0)
	exami_state = db.Column(db.Integer, default=0)
	fullscore = db.Column(db.Integer, default=0)
	getscore = db.Column(db.Integer, default=0)
	fullreply = db.Column(db.TEXT)


class Quesperform(db.Model):
	__tablename__ = 'quesperform'
	qperformid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	pperformid = db.Column(db.Integer, db.ForeignKey('paperperform.pperformid'))
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	ques_id = db.Column(db.Integer, db.ForeignKey('questions.quesid'))
	did_date = db.Column(db.DateTime)
	ques_type = db.Column(db.String(32))
	examiner = db.Column(db.String(32))
	comments = db.Column(db.TEXT)
	exami_date = db.Column(db.DateTime)
	answer = db.Column(db.String(256))
	reply = db.Column(db.String(256))
	fullscore = db.Column(db.Integer, default=0)
	getscore = db.Column(db.Integer, default=0)


class Courseperform(db.Model):
	__tablename__ = 'courseperform'
	cperformid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	course_id = db.Column(db.Integer, db.ForeignKey('courselist.courseid'))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	start_time = db.Column(db.DateTime)
	finish_rate = db.Column(db.Integer, default=0)
	finish_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Videoperform(db.Model):
	__tablename__ = 'videoperform'
	vperformid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	video_id = db.Column(db.Integer, db.ForeignKey('videos.videoid'))
	did_time = db.Column(db.Integer, default=0)
	finish_rate = db.Column(db.Integer, default=0)
	watch_details = db.Column(db.TEXT)


class Biwen(db.Model):
	__tablename__ = 'biwen'
	biwenid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	author_name = db.Column(db.String(32))
	coauthor_ids = db.Column(db.String(256))
	coauthor_names = db.Column(db.String(256))
	coediting = db.Column(db.Integer, default=0)
	coeditor_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	coeditor_name = db.Column(db.String(32))
	title = db.Column(db.String(256))
	class1 = db.Column(db.String(32))
	class2 = db.Column(db.String(32))
	class3 = db.Column(db.String(32))
	taps = db.Column(db.String(256))
	desc = db.Column(db.TEXT)
	fulltext = db.Column(db.TEXT)
	zan = db.Column(db.Integer, default=0)
	score = db.Column(db.Integer, default=0)
	viewed_num = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	init_price = db.Column(db.Integer, default=0)
	final_price = db.Column(db.Integer, default=0)
	examiner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	examiner_name = db.Column(db.String(32))
	exami_time = db.Column(db.DateTime)
	exami_comments = db.Column(db.TEXT)
	examinate_times = db.Column(db.Integer, default=0)
	scarcity = db.Column(db.Float, default=0.0)
	progressiveness = db.Column(db.Float, default=0.0)
	operability = db.Column(db.Float, default=0.0)
	reviewed = db.Column(db.Integer, default=0)
	reviewed_time = db.Column(db.DateTime)
	rel_ques = db.Column(db.String(256))
	privacy = db.Column(db.String(32))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	amend_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Zhuanlan(db.Model):
	__tablename__ = 'zhuanlan'
	zhuanlanid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	zhuanlan_title = db.Column(db.String(256))
	zhuanlan_desc = db.Column(db.String(256))
	zhuanlan_publisherid = db.Column(db.Integer, db.ForeignKey('users.id'))
	biwen_num = db.Column(db.Integer, default=0)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	modify_time = db.Column(db.DateTime)
	zan = db.Column(db.Integer, default=0)
	favor_num = db.Column(db.Integer, default=0)
	favor_days = db.Column(db.Integer, default=0)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

	rela_biwens = db.relationship('Biwen', secondary='biwenitems', backref=db.backref('rela_zhuanlan', lazy='dynamic'))

biwenitems = db.Table('biwenitems',
	db.Column('biwenitemid', db.Integer, primary_key=True, autoincrement=True),
	db.Column('zhuanlanid', db.Integer, db.ForeignKey('zhuanlan.zhuanlanid')),
	db.Column('biwenid', db.Integer, db.ForeignKey('biwen.biwenid')),
	db.Column('biwen_num', db.Integer, default=0),
	db.Column('show_title', db.String(256)),
	db.Column('zhuanlan_part', db.String(256))
)

class Brainmap(db.Model):
	__tablename__ = 'brainmap'
	mapid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	root_id = db.Column(db.String(32))
	root_topic = db.Column(db.String(256))
	mapdata = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	edit_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)

class Brainitem(db.Model):
	__tablename__ = 'brainitem'
	itid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	graphid = db.Column(db.String(32))
	graphtopic = db.Column(db.String(256))
	parentid = db.Column(db.String(32))
	parenttopic = db.Column(db.String(256))
	itemid = db.Column(db.String(32))
	itemtopic = db.Column(db.String(256))
	childrenid = db.Column(db.TEXT)
	childrentopic = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	edit_time = db.Column(db.DateTime)
	hidden = db.Column(db.Integer, default=0)
	hidden_time = db.Column(db.DateTime)




class History(db.Model):
	__tablename__ = 'history'
	historyid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	target_id = db.Column(db.Integer)
	target_type = db.Column(db.String(32))
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())

class Recommend(db.Model):
	__tablename__ = 'recommend'
	recommid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	recomm_type = db.Column(db.String(32))
	sender_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
	target_id = db.Column(db.Integer)
	comments = db.Column(db.TEXT)
	create_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	accepted = db.Column(db.Integer, default=0)
	accept_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())
	dropped = db.Column(db.Integer, default=0)
	drop_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.now())


class Classtree(db.Model):
	__tablename__ = 'classtree'
	nodeid = db.Column(db.Integer, primary_key=True, autoincrement=True)
	title = db.Column(db.String(32))
	par_id = db.Column(db.Integer)
	child_num = db.Column(db.Integer)
	class_degree = db.Column(db.Integer)
	rank_num = db.Column(db.Integer)
	keywords = db.Column(db.TEXT)