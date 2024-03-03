from sqlalchemy import create_engine,text
from sqlalchemy.orm import scoped_session, sessionmaker
engine = create_engine('mysql+pymysql://root:006622@localhost:3306/wow')
db = scoped_session(sessionmaker(bind=engine))

sql = '''
INSERT INTO users (username, phone, role, email, password)
    VALUES ('黎伟', '15821123639', 'admin', 'omige@live.cn', '$2b$12$sErK932BEaLyIisz30PubepN7w91RLwkISWbAFYgUgoIqh8goJLEW');
'''
db.execute(text(sql))

db.commit()
# 关闭数据库连接
db.close()
engine.dispose()