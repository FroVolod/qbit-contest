import asyncio
import os

from autobahn.asyncio.component import Component
from autobahn.asyncio.component import run

from .constants import COURSES_DICT, ALLOW_LANGUAGE
from .tables_db import (
    session,
    Contests,
    UserSessions,
    Problems,
    ContestProblems,
    Groups,
    Users,
    UserGroup,
    ContestUsers,
)


comp = Component()


async def check_dsid(dsid, author_id=None):
    print(f'Checking role for Author: {author_id}')
    user_session = session.query(UserSessions).filter(UserSessions.session_id == dsid).first()
    print(f'check dsid: user_session -- {user_session}')
    if not author_id:
        author_id = user_session.session_data.split('uid|i:')[1].split(';')[0]
        author = session.query(Users).filter(Users.user_id == author_id).first().FIO
        print(f'author: {author}')
        return (author_id, author)
    elif (author_id == user_session.session_data.split('uid|i:')[1].split(';')[0]
        and session.query(Users).filter(Users.user_id == author_id).first().access >= 65534):
        return author_id
    return None


async def to_contests(out_contests_dict):
    # запись данных в таблицу contests
    duration_time = str(out_contests_dict["timeDurationSec"])
    new_contest = Contests(
        title=out_contests_dict["contestTitle"],
        contest_type=out_contests_dict["contestType"],
        start_time=out_contests_dict["startTime"],
        options=out_contests_dict["options"],
        data='a:2:{s:13:"duration_time";i:'
        + duration_time
        + ';s:13:"absolute_time";i:0;}',
        info=out_contests_dict["info"],
        author_id=out_contests_dict["authorId"],
        allow_languages=out_contests_dict["allowLanguages"],
    )
    session.add(new_contest)
    session.commit()
    
    task_to_contest_problems = asyncio.create_task(to_contest_problems(out_contests_dict["problems"], new_contest.contest_id))
    task_to_contest_users = asyncio.create_task(to_contest_users(out_contests_dict["idContestParticipantsGroups"], new_contest.contest_id))

    await asyncio.gather(task_to_contest_problems, task_to_contest_users)


async def to_contest_problems(out_problems, contest_id):
    # запись зависимостей в таблицу contest_problems
    out_problems = [problem[0] for problem in out_problems]
    contest_problems = []
    problems = (
        session.query(Problems)
        .filter(Problems.problem_id.in_(out_problems))
        .all()
    )
    print(f'problems: {problems} ** {out_problems}')
    for problem in problems:
        contest_problems.append(
            ContestProblems(
                problem_id=problem.problem_id,
                short_name="",
                contest_id=contest_id,
            )
        )
    session.add_all(contest_problems)


async def to_contest_users(groups, contest_id):
    # запись зависимостей в таблицу contest_users
    contest_users = []
    for group_id in groups:
        users = session.query(UserGroup).filter(UserGroup.group_id == group_id).all()
        for user in users:
            contest_users.append(
                ContestUsers(
                    contest_id=contest_id,
                    user_id=user.user_id,
                    reg_status=3,
                    reg_data="",
                )
            )
    session.add_all(contest_users)
    print("запись зависимостей в таблицу contest_users: OK")


@comp.register("com.demo.get-author")
async def get_author(dsid):
    print(f"Getting author_id for session id {dsid}")
    author = await check_dsid(dsid)
    print(f"author: {author}")
    await asyncio.sleep(2)
    return author


@comp.register("com.demo.create-contest")
async def create_contest(out_contests_dict):
    print(
        f"Create contest called with args:\n-- {out_contests_dict}\nSleeping for 4 seconds..."
    )
    # Проверка прав пользователя
    check = await check_dsid(out_contests_dict['dsid'], out_contests_dict['authorId'])
    print(f'create_contest: check_dsid -- {check}')
    if not check:
        return
    # запись данных в БД
    await to_contests(out_contests_dict)
    session.commit()
    await asyncio.sleep(2)
    return 'Contest created'


@comp.register("com.demo.get-participants-groups")
async def get_contest_participants_groups(dsid, user_id):
    # Проверка прав пользователя
    check = await check_dsid(dsid, user_id)
    print(f'create_contest: check_dsid -- {check}')
    if not check:
        return

    print("Getting the participants groups with user:\n")
    print(session)
    print(dir(session))
    print(session.__dict__)
    print(session.is_active)
    user = session.query(Users).filter(Users.user_id == user_id).first()
    print(f"-- {user.nickname}")
    await asyncio.sleep(2)
    groups = [
        (q.group_id, q.group_name)
        for q in session.query(Groups).filter(Groups.teacher_id == user.user_id).all()
    ]
    print(f"groups:\n-- {groups}")
    return groups


@comp.register("com.demo.get-contests-dictionaries")
async def get_contests_dictionaries(dsid, user_id, course_id, lang):
    # Проверка прав пользователя
    check = await check_dsid(dsid, user_id)
    print(f'create_contest: check_dsid -- {check}')
    if not check:
        return
    
    print(
        f"Getting the titles of the contests with args:\n-- course: {course_id}\n-- language: {lang}\nSleeping for 4 seconds..."
    )
    await asyncio.sleep(2)
    contests_dicts = []
    for contest in COURSES_DICT[course_id]["contests"]:
        try:
            contest_dict = {
                "course_title": COURSES_DICT[course_id]["course_title"][lang]
            }
            print(f"contest: {contest}")
            for key, value in contest.items():
                if type(value) is dict:
                    contest_dict[key] = value[lang]
                else:
                    if key == 'problems':
                        problems_list = []
                        problems = [p.problem_id for p in session.query(Problems).all()]
                        for problem in value:
                            if int(problem) in problems:
                                title = session.query(Problems).get({'problem_id': problem}).title
                                problems_list.append((problem, title))
                        contest_dict[key] = problems_list
                    else:
                        contest_dict[key] = value
            print("contest_dict", contest_dict)
            contests_dicts.append(contest_dict)
        except KeyError as error:
            print(f"# Error: contest title is missing in this language -- {error}")
            print("except-- contests", contests_dicts)
            return contests_dicts
    print("contests_dicts: ", contests_dicts)
    return contests_dicts


@comp.register("com.demo.get-titles-courses")
async def get_titles_courses(dsid, user_id, lang):
    # Проверка прав пользователя
    check = await check_dsid(dsid, user_id)
    print(f'create_contest: check_dsid -- {check}')
    if not check:
        return
    
    print(
        f"Getting the titles of the cuorses with language: {lang}:\nSleeping for 4 seconds..."
    )
    await asyncio.sleep(2)
    titles = []
    for course_id, course in COURSES_DICT.items():
        try:
            titles.append(
                {"course_id": course_id, "course_title": course["course_title"][lang]}
            )
            print(f'Course_lang: {course["course_title"][lang]}')
        except Exception as error:
            print(f"# Error: course title is missing in this language -- {error}")
    print("OK")
    print("titles: ", titles)
    return titles


@comp.register("com.demo.get-allow-language")
async def get_allow_language():
    await asyncio.sleep(2)
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
                    "type": "websocket",
                    "url": os.getenv("WAMP_DEMO_URL", "ws://127.0.0.1:8080/ws"),
                    "serializers": ["json"],
                },
                component._check_native_endpoint,
            )
        ]
        component._realm = "demo"
        # component._authentication = {
        #    'ticket': {
        #        'ticket': os.getenv('WAMP_DEMO_BACKEND_SECRET', 'backend'),
        #        'authid': 'demo-backend',
        #    },
        # }
        self.components.append(component)

    def run(self):
        print("Running...")
        run(self.components)
        print("Bye.")


def create_app():
    app = App()
    for component in [comp]:
        app.register_component(component)
    return app
