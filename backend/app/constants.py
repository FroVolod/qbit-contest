TOURNAMENT_PARTICIPANTS = ['single', 'group', ]

COURSES_DICT = {
    "basics_programming": {
        "course_title": {
            "ru": "Основы программирования",
            "ua": "Основи программування",
            "en": "Programming Basics",
        },
        "contests": [
            {
                "contest_title": {"ru": "Привет Мир!"},
                "duration": "3600",
                "problems": ["1000", "1001", "1002", "1003"],
                "info": {
                    "ru": "Привет Мир!",
                    "ua": "",
                    "en": "",
                }
            },
            {
                "contest_title": {"ru": "Вспомним, товарищи!"},
                "duration": "3600",
                "problems": ["1003", "1004", "1006"],
                "info": {
                    "ru": "Вспомним, товарищи!",
                    "ua": "",
                    "en": "",
                }
            },
        ],
    },
    "basic_algorithms": {
        "course_title": {"ru": "Базовые алгоритмы"},
        "contests": [
            {
                "contest_title": {"ru": "Сортировка и поиск"},
                "duration": "3600",
                "problems": ["1007", "1008", "1009"],
                "info": {
                    "ru": "Сортировка и поиск",
                    "ua": "",
                    "en": "",
                }
            },
            {
                "contest_title": {"ru": "Сортировка и поиск 2"},
                "duration": "3600",
                "problems": ["1010", "1011", "1012"],
                "info": {
                    "ru": "Сортировка и поиск 2",
                    "ua": "",
                    "en": "",
                }
            },
        ],
    },
    "training": {
        "course_title": {"ua": "Тренування1"},
        "contests": [
            {
                "contest_title": {"ua": "Лабораторна робота №1"},
                "duration": "3600",
                "problems": ["1007", "1008", "1009"],
                "info": {
                    "ru": "",
                    "ua": "Лабораторна робота №1",
                    "en": "",
                }
            },
            {
                "contest_title": {"ua": "Лабораторна робота №2"},
                "duration": "3600",
                "problems": ["1010", "1011", "1012"],
                "info": {
                    "ru": "",
                    "ua": "Лабораторна робота №2",
                    "en": "",
                }
            },
        ],
        
    },
}

ALLOW_LANGUAGE = (
    ( 2, 'C (C89) / GCC 8.x, ANSI C'),
    ( 3, 'C++ (C++03) / GNU C++ (G++) 8.x, ISO/IEC 14882:2003'),
    ( 4, 'Pascal / FreePascal Compiler 3.0'),
    (11, 'Python 2 / Python 2.7'),
    (12, 'Python 3 / Python 3.7'),
    (13, 'Java 7 / OpenJDK 7'),
    (14, 'C# / Mono 5.20'),
    (15, 'Ruby / Ruby 2.5'),
    (16, 'Go / Golang 1.12'),
    (17, 'Java 8 / OracleJDK 8'),
    (18, 'C (C11) / GCC 8.x, ISO/IEC 9899:2011'),
    (19, 'C++ (C++11) / GNU C++ (G++) 8.x, ISO/IEC 14882:2011'),
    (20, 'C++ (C++14) / GNU C++ (G++) 8.x, ISO/IEC 14882:2014'),
    (21, 'Haskell / GHC 8.4'),
    (22, 'Nim / Nim 0.29'),
    (23, 'Rust / Rust 1.34'),
    (24, 'Scala / Scala 2.12'),
    (25, 'PHP / PHP 7.3'),
    (26, 'Kotlin / Kotlin 1.3'),
    (27, 'Bash / Bash 5.0'),
    (28, 'Python for Data Science / Python 3.7 + numpy, pandas, scipy, scikit-learn, cdd, cvxopt'),
    (29, 'VB.NET / Mono 5.18'),
    (30, 'C++ (C++17) / GNU C++ (G++) 8.x, ISO/IEC 14882:2017'),
    (31, 'JavaScript (Node.JS) / Node.JS 11'),
    (33, 'OCaml / OCaml 4.07'),
    (34, 'Swift / Swift 5.0'),
    (39, 'Delphi / FreePascal Compiler 3.0'),
)
