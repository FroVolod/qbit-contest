import asyncio
import os

from autobahn.asyncio.component import Component
from autobahn.asyncio.component import run

from .constants import COURSES_DICT


courses_titles = [title for title in COURSES_DICT.keys()]

comp = Component()

@comp.register('com.demo.create-contest')
async def create_contest(*args, **kwargs):
    print(f'Create contest called with args:\n-- {args}\nSleeping for 4 seconds...')
    await asyncio.sleep(4)
    print('Create contest handler has slept for 4 seconds.')
    return 55

@comp.register('com.demo.get-titles-contests')
async def get_titles_contests(course, lang):
    print(f'Getting the titles of the contests with args:\n-- course: {course}\n-- language: {lang}\nSleeping for 4 seconds...')
    await asyncio.sleep(4)
    contests_titles = []
    for title in COURSES_DICT.keys():
        print('title: ', title)
        try:
            if COURSES_DICT[title]['course_title'][lang] == course:
                try:
                    contests = [contest for contest in COURSES_DICT[title]['contests']]
                    print(f'contests: {contests}')
                    contests_titles = [title['contest_title'][lang] for title in contests]
                    print(contests_titles)
                except Exception as error:
                    print(f'# Error: contest title is missing in this language -- {error}')
                    print('except-- contests_titles', contests_titles)
                    return contests_titles
                return contests_titles
        except Exception as error:
            print(f'# Error: contest title is missing in this language -- {error}')
    print('no contests titles', contests_titles)
    return contests_titles

@comp.register('com.demo.get-titles-courses')
async def get_titles_courses(language):
    print(f'Getting the titles of the cuorses with language: {language}:\nSleeping for 4 seconds...')
    await asyncio.sleep(4)
    titles = []
    for title in courses_titles:
        try:
            titles.append(COURSES_DICT[title]['course_title'][language])
            print(f'Course_lang: {COURSES_DICT[title]["course_title"][language]}')
        except Exception as error:
            print(f'# Error: course title is missing in this language -- {error}')
    print('OK')
    print('titles: ', titles)
    return titles


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
