from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, MetaData, Table, Column, Integer
from sqlalchemy.types import VARCHAR


engine = create_engine('mysql+mysqldb://root:example@127.0.0.1:3306/qbit', pool_timeout=20, pool_recycle=299)

Base = automap_base()
Base.prepare(engine, reflect=True)

Groups = Base.classes['2018_groups']
Users = Base.classes['2018_users']
Contests = Base.classes['2018_contests']

session = Session(engine)
