"""add videoperform

Revision ID: da7c2fa8e85e
Revises: df6f83eb0e6b
Create Date: 2023-07-15 12:49:57.347979

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'da7c2fa8e85e'
down_revision = 'df6f83eb0e6b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('courseperform',
    sa.Column('cperformid', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('course_id', sa.Integer(), nullable=True),
    sa.Column('create_time', sa.DateTime(), nullable=False),
    sa.Column('start_time', sa.DateTime(), nullable=True),
    sa.Column('finish_rate', sa.Integer(), nullable=True),
    sa.Column('finish_time', sa.DateTime(), nullable=True),
    sa.Column('hidden', sa.Integer(), nullable=True),
    sa.Column('hidden_time', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['course_id'], ['courselist.courseid'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('cperformid')
    )
    op.drop_column('biwen', 'rel_anhao')
    op.drop_column('biwen', 'rel_appnum')
    op.drop_column('biwen', 'rel_pubnum')
    op.add_column('questions', sa.Column('ques_class3', sa.String(length=32), nullable=True))
    op.add_column('questions', sa.Column('keywords', sa.String(length=256), nullable=True))
    op.add_column('questions', sa.Column('rel_tuwenid', sa.Integer(), nullable=True))
    op.add_column('testpapers', sa.Column('threshold', sa.Integer(), nullable=True))
    op.add_column('videos', sa.Column('video_class3', sa.String(length=32), nullable=True))
    op.add_column('videos', sa.Column('keywords', sa.String(length=256), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('videos', 'keywords')
    op.drop_column('videos', 'video_class3')
    op.drop_column('testpapers', 'threshold')
    op.drop_column('questions', 'rel_tuwenid')
    op.drop_column('questions', 'keywords')
    op.drop_column('questions', 'ques_class3')
    op.add_column('biwen', sa.Column('rel_pubnum', mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_general_ci', length=32), nullable=True))
    op.add_column('biwen', sa.Column('rel_appnum', mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_general_ci', length=32), nullable=True))
    op.add_column('biwen', sa.Column('rel_anhao', mysql.VARCHAR(charset='utf8mb4', collation='utf8mb4_general_ci', length=32), nullable=True))
    op.drop_table('courseperform')
    # ### end Alembic commands ###