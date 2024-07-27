from flask import current_app, request
import logging

logging.basicConfig(level=logging.DEBUG)
#console_handler = logging.StreamHandler()
#console_handler.setLevel(logging.ERROR)
logging_format = logging.Formatter('%(asctime)s - %(levelname)s - %(filename)s - %(funcName)s - %(lineno)s - %(message)s')


login_log = logging.getLogger("login_log")
login_file_handler = logging.FileHandler('apps/log/login/daily/dailylogin1.log', encoding='UTF-8')
login_file_handler.setLevel(logging.DEBUG)
login_file_handler.setFormatter(logging_format)
login_log.addHandler(login_file_handler)
def loginloginfo(msg):
    user_ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    #current_app.logger.addHandler(console_handler)
    login_log.info('%s - %s', user_ip, msg)

