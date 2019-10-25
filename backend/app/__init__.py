import asyncio
import os

from autobahn.asyncio.component import Component
from autobahn.asyncio.component import run

from .constants import COURSES_DICT, ALLOW_LANGUAGE


comp = Component()

@comp.register('com.demo.create-contest')
async def create_contest(*args, **kwargs):
    print(f'Create contest called with args:\n-- {args}\nSleeping for 4 seconds...')
    await asyncio.sleep(1)
    print('Create contest handler has slept for 4 seconds.')
    return 55

@comp.register('com.demo.get-contests-dictionaries')
async def get_titles_contests(course_id, lang):
    print(f'Getting the titles of the contests with args:\n-- course: {course_id}\n-- language: {lang}\nSleeping for 4 seconds...')
    await asyncio.sleep(2)
    contests_dicts = []
    for contest in COURSES_DICT[course_id]['contests']:
        try:
            contest_dict = {}
            print(f'contest: {contest}')
            for key, value in contest.items():
                if type(value) is dict:
                    contest_dict[key] = value[lang]
                else:
                    contest_dict[key] = value
            print('contest_dict', contest_dict)
            contests_dicts.append(contest_dict)
        except KeyError as error:
            print(f'# Error: contest title is missing in this language -- {error}')
            print('except-- contests', contests_dicts)
            return contests_dicts
    print('contests_dicts: ', contests_dicts)
    return contests_dicts

@comp.register('com.demo.get-titles-courses')
async def get_titles_courses(lang):
    print(f'Getting the titles of the cuorses with language: {lang}:\nSleeping for 4 seconds...')
    await asyncio.sleep(2)
    titles = []
    for course_id, course in COURSES_DICT.items():
        try:
            titles.append({'course_id': course_id, 'course_title': course['course_title'][lang]})
            print(f'Course_lang: {course["course_title"][lang]}')
        except Exception as error:
            print(f'# Error: course title is missing in this language -- {error}')
    print('OK')
    print('titles: ', titles)
    return titles

@comp.register('com.demo.get-allow-language')
async def get_allow_language():
    return ALLOW_LANGUAGE


class App:
    def __init__(self):
        self.components = []

    def register_component(self, component):
        from autobahn.wamp.component import _create_transport
        component._transports = [
            _create_transport(
                0,
                {
                    'type': 'websocket',
                    'url': os.getenv('WAMP_DEMO_URL', 'ws://localhost:8080/ws'),
                    'serializers': ['json'],
                },
                component._check_native_endpoint
            )
        ]
        component._realm = 'demo'
        #component._authentication = {
        #    'ticket': {
        #        'ticket': os.getenv('WAMP_DEMO_BACKEND_SECRET', 'backend'),
        #        'authid': 'demo-backend',
        #    },
        #}
        self.components.append(component)

    def run(self):
        print('Running...')
        run(self.components)
        print('Bye.')


def create_app():
    app = App()
    for component in [comp]:
        app.register_component(component)
    return app
