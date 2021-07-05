# Generated by Django 3.2.3 on 2021-07-04 08:01

import django.core.validators
from django.db import migrations, models
import engine.validators


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0005_rename_practise_question_quizattempt_quiz'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='quizchoice',
            options={},
        ),
        migrations.AlterField(
            model_name='quizattempt',
            name='response',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(9), django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterField(
            model_name='quizchoice',
            name='choice',
            field=models.CharField(max_length=10, validators=[engine.validators.validate_choices], verbose_name='QuizChoice'),
        ),
        migrations.AlterField(
            model_name='quizchoice',
            name='position',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(9), django.core.validators.MinValueValidator(0)]),
        ),
        migrations.AlterUniqueTogether(
            name='quizchoice',
            unique_together=set(),
        ),
    ]
