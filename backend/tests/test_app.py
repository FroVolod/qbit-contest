import pytest
import app


def test_qq():
    assert 1 == 1

# @pytest.mark.asyncio
# async def test_get_titles_contests():
#     res = await app.get_titles_contests('training', 'ua')
#     assert 'Лабораторна робота №1' == res[0]

@pytest.mark.asyncio
async def test_get_titles_courses():
    res_ua = await app.get_titles_courses('ua')
    assert res_ua[0]['course_title'] == 'Основи программування'
    assert res_ua[1]['course_title'] == 'Тренування1'
    res_ru = await app.get_titles_courses('ru')
    assert res_ru[0]['course_title'] == 'Основы программирования'
    assert res_ru[1]['course_title'] == 'Базовые алгоритмы'