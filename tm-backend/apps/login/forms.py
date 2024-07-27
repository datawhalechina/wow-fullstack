# coding:utf8
# coding: utf8
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField, TextAreaField, SelectField, SelectMultipleField
from wtforms.validators import DataRequired, ValidationError, EqualTo, Email, Regexp
from apps.login.models import User
from flask import session


class RegisterForm(FlaskForm):
    name = StringField(
        label='用户名',
        validators=[
            DataRequired("请输入用户名！")
        ],
        description='用户名',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入用户名称！"
        }
    )

    pwd = PasswordField(
        label='密码',
        validators=[
            DataRequired("请输入密码！")
        ],
        description='密码',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入密码！"
        }
    )

    repwd = PasswordField(
        label='确认密码',
        validators=[
            DataRequired("请输入重复密码！"),
            EqualTo('pwd', message='两次密码输入不一致！')
        ],
        description='确认密码',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请再次输入密码！"
        }
    )

    email = StringField(
        label='邮箱',
        validators=[
            DataRequired("请输入邮箱！"),
            Email("邮箱格式不正确！")
        ],
        description='邮箱',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入用户邮箱！"
        }
    )

    phone = StringField(
        label='手机',
        validators=[
            DataRequired("请输入手机号码！"),
            Regexp("^1[0-9]{10}$", message="手机格式不正确！")
        ],
        description='手机号码',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入手机号码！"
        }
    )

    submit = SubmitField(
        '确定',
        render_kw={
            'class': "btn btn-lg btn-success btn-block"
        }
    )

    def validate_name(self, field):
        name = field.data
        user = User.query.filter_by(name=name).count()
        if user == 1:
            raise ValidationError("用户名已被占用！")

    def validate_email(self, field):
        email = field.data
        user = User.query.filter_by(email=email).count()
        if user == 1:
            raise ValidationError("邮箱已被占用！")

    def validate_phone(self, field):
        phone = field.data
        user = User.query.filter_by(phone=phone).count()
        if user == 1:
            raise ValidationError("用户名已被占用！")


class LoginForm(FlaskForm):
    name = StringField(
        label='用户名',
        validators=[
            DataRequired("请输入用户名！")
        ],
        description='用户名',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入用户名称！"
        }
    )

    pwd = PasswordField(
        label='密码',
        validators=[
            DataRequired("请输入密码！")
        ],
        description='密码',
        render_kw={
            'class': "form-control input-lg",
            'placeholder': "请输入密码！"
        }
    )

    submit = SubmitField(
        '确定',
        render_kw={
            'class': "btn btn-lg btn-primary btn-block"
        }
    )

    def validate_name(self, field):  # validate + 字段名
        name = field.data  # 获取到用户名输入
        name = User.query.filter_by(name=name).count()  # 数据库查询
        if name == 0:
            raise ValidationError("账号不存在")  # 显示到前端


class UserdetailForm(FlaskForm):
    name = StringField(
        label='用户名',
        validators=[
            DataRequired("请输入用户名！")
        ],
        description='用户名',
        render_kw={
            'class': "form-control",
            'placeholder': "请输入用户名称！"
        }
    )

    email = StringField(
        label='邮箱',
        validators=[
            DataRequired("请输入邮箱！"),
            Email("邮箱格式不正确！")
        ],
        description='邮箱',
        render_kw={
            'class': "form-control",
            'placeholder': "请输入用户邮箱！"
        }
    )

    phone = StringField(
        label='手机',
        validators=[
            DataRequired("请输入手机号码！"),
            Regexp("1[3458]\\d[9]", message="手机格式不正确！")
        ],
        description='手机号码',
        render_kw={
            'class': "form-control",
            'placeholder': "请输入手机号码！"
        }
    )

    # 个人头像
    face = FileField(
        label='头像',
        validators=[
            DataRequired("请上传头像！")
        ],
        description="头像"
    )

    # 个人简介
    info = TextAreaField(
        label='简介',
        validators=[
            DataRequired("请输入简介！")
        ],
        description='简介',
        render_kw={
            'placeholder': '十年窗下无人问，一举成名天下知',
            'class': "form-control",
            'rows': "10",
        }
    )

    submit = SubmitField(
        '保存修改',
        render_kw={
            'class': "btn btn-success"
        }
    )


# 修改密码表单
class PwdForm(FlaskForm):
    old_pwd = PasswordField(
        label='旧密码',
        validators=[
            DataRequired("请输入旧密码！")
        ],
        description="旧密码",
        render_kw={
            'class': "form-control",
            'placeholder': "请输入密码！",
        }
    )

    new_pwd = PasswordField(
        label='新密码',
        validators=[
            DataRequired("请输入新密码！")
        ],
        description="新密码",
        render_kw={
            'class': "form-control",
            'placeholder': "请输入新密码！",
        }
    )

    submit = SubmitField(
        '修改密码',
        render_kw={
            'class': "btn btn-primary btn-block btn-flat"
        }
    )

    def validate_old_pwd(self, field):  # validate + 字段名
        pwd = field.data  # 获取到用户名输入
        name = session['user']
        user = User.query.filter_by(name=name).first()  # 数据库查询
        if not user.check_pwd(pwd):
            raise ValidationError("旧密码错误！")  # 显示到前端

    def validate_new_pwd(self, field):
        pwds = field.data
        if len(pwds) < 6:
            raise ValidationError("新密码长度不低于6位！")


class CommentForm(FlaskForm):
    # 评论
    content = TextAreaField(
        label='内容',
        validators=[
            DataRequired("请输入内容！")
        ],
        description='内容',
        render_kw={
            'required': 'required',
            'placeholder': '十年窗下无人问，一举成名天下知',
            'id': 'input_content'
        }
    )

    submit = SubmitField(
        '提交评论',
        render_kw={
            "class": "btn btn-success",
            "id": "btn-sub"
        }
    )
