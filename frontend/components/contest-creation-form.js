import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from "reactstrap";

import DatePicker from "react-datepicker"; //https://github.com/Hacker0x01/react-datepicker
import "react-datepicker/dist/react-datepicker.css";

import Modal from "./modal";


export default class extends React.Component {
  state = {
    authorId: null,
    author: null,
    contestType: "otbor",
    courseTitle: null,
    contestTitle: null,
    problems: null,
    allowLanguages: null,
    startTime: null,
    contestParticipantsGroups: {},
    options: 4,
    data: null,
    info: "информация",
    date: new Date(),
    courses: null,
    contestsDict: null,
    programmingLanguagesEnabled: {},
    problemsEnabled: {},
    participantsGroups: [],
    showParticipantsGroupsSpinner: true,
    contestDuration: {
      minutes: [60, "минуты", "минутах"],
      hours: [3600, "часы", "часах"],
      days: [86400, "дни", "днях"]
    },
    periodDuration: "minutes",
    timeDurationSec: null,
    showModal: false,
    messageModal: null
  };

  componentDidMount() {
    console.log("DIDMount open", this.props.state.session, this.props.state.DSID);
    this.getAuthor(this.props.state.DSID)
      .then(author => 
        this.getParticipantsGroups(author[0])
          .then(participantsGroups => {
            this.setState({
              authorId: author[0],
              author: author[1],
              participantsGroups,
              showParticipantsGroupsSpinner: false
            });
          })
          .catch(e =>
            console.log(
              "componentDidMount: setting the contestParticipans error -- ",
              e
            )
          )
        )
      .catch(e => 
        console.log(
          "componentDidMount: setting the Author error -- ",
          e
        )
      );
  }

  componentDidUpdate(nextProps) {
    console.log(
      "DidUpdate open", this.state.courses,
      "language: ", this.props.state.language
    );
    if (!this.props.state.session) return;
    console.log("this.state.courses", this.state.courses);
    console.log("this.props: ", this.props);
    console.log("nextProps: ", nextProps);
    console.log("************** state: ", this.state);
    if (this.state.courses && this.props === nextProps) {
      console.log("DidUpdate: no changes");
      return;
    }
    this.getTitlesCourses()
      .then(courses => {
        console.log("DidUpdate getTitlesCourses response: ", courses);
        this.getContestsDict(courses[0].course_id);
        if (courses === this.state.courses) return;
        this.setState({ courses });
      })
      .catch(e => console.log("DidUpdate getTitlesCourses error:", e));
    console.log("DidUpdate: Loading the titles of the courses ...");
    console.log(
      "DidUpdate exit", this.state.courses,
      "language: ", this.props.state.language
    );
    if (this.state.contestParticipansGroup && this.props === nextProps) return;
    this.getParticipantsGroups(this.state.authorId)
      .then(participantsGroups => {
        console.log(
          "DidUpdate getParticipantsGroups response: ", participantsGroups
        );
        if (participantsGroups === this.state.participantsGroups) return;
        console.log(
          "componentDidUpdate: setting state.conestParticipantsGroups"
        );
        this.setState({
          participantsGroups,
          showParticipantsGroupsSpinner: false
        });
      })
      .catch(e =>
        console.log(
          "componentDidUpdate: setting the contestParticipans error -- ",
          e
        )
      );
    if (this.state.allowLanguages) return;
    this.getAllowLanguage()
      .then(allowLanguages => {
        console.log("DidUpdate getAllowLanguage response: ", allowLanguages);
        const programmingLanguagesEnabled = {};
        for (const lang of allowLanguages) {
          programmingLanguagesEnabled[lang] = true;
        }
        this.setState({ allowLanguages, programmingLanguagesEnabled });
      })
      .catch(e => console.log("DidUpdate getAllowLanguage error:", e));
  }

  getAuthor = async (dsid) => {
    console.log('Getting Author with cookie: ', dsid)
    const author = await this.props.state.session.call("com.demo.get-author", [dsid])
    return author
  } 

  createContest = async () => {
    if (Object.keys(this.state.contestParticipantsGroups).length === 0) {
      this.isShowModal(true, 'Необходимо выбрать участников турнира')
      return
    }
    if (!this.state.timeDurationSec) {
      this.isShowModal(true, 'Необходимо ввести значение продолжительности турнира')
      return
    }
    if ((this.state.date - new Date()) < 0) {
      this.isShowModal(true, 'Необходимо указать начало турнира')
      return
    }
    console.log('On click "Create contest"');
    let problems = this.state.problems.filter(
      x => this.state.problemsEnabled[x]
    );
    console.log("createContest problems: ", problems);
    let allowLanguages = this.state.allowLanguages
      .filter(lang => this.state.programmingLanguagesEnabled[lang])
      .map(lang => lang[0])
      .join(" ");
    console.log("createContest allowLanguages:", allowLanguages);
    let idContestParticipantsGroups = this.state.participantsGroups
      .filter(group => this.state.contestParticipantsGroups[group])
      .map(group => group[0]);
    console.log(
      "createContest idContestParticipantsGroups:",
      idContestParticipantsGroups
    );
    const outContestsDict = {
      authorId: this.state.authorId,
      dsid: this.props.state.DSID,
      contestType: this.state.contestType,
      courseTitle: this.state.courseTitle,
      contestTitle: this.state.contestTitle,
      problems,
      allowLanguages,
      startTime: this.state.date.getTime() / 1000,
      idContestParticipantsGroups,
      options: "4",
      info: this.state.info,
      timeDurationSec: this.state.timeDurationSec
    };
    const isCreated = await this.props.state.session.call("com.demo.create-contest", [
      outContestsDict
    ]);
    console.log("isCreated: ", isCreated);
    if (isCreated) {
      console.log("createContest open isShowModal")
      this.isShowModal(true, 'Турнир успешно создан')
    }
    else {
      this.isShowModal(true, 'У Вас недостаточно прав для создания турнира')
    };
  };

  isShowModal = (showModal, messageModal=null) => {
    console.log("isShowModal: ", showModal)
    this.setState({ showModal, messageModal })
  }

  getAllowLanguage = async () => {
    console.log("Getting allow language ...");
    const allowLanguages = await this.props.state.session.call(
      "com.demo.get-allow-language",
      []
    );
    console.log("Allow language: ", allowLanguages);
    return allowLanguages;
  };

  onCourseChange = e => {
    this.getContestsDict(e.target.value);
  };

  getParticipantsGroups = async authorId => {
    console.log("getParticipantsGroups value: ", authorId);
    const participantsGroups = await this.props.state.session.call(
      "com.demo.get-participants-groups",
      [this.props.state.DSID, authorId]
    );
    console.log("participantsGroups", participantsGroups);
    return participantsGroups;
  };

  setContestParticipantsGroups = e => {
    console.log(
      "Setting the setContestParticipantsGroups with: ",
      e.target.checked,
      e.target.name
    );
    const group = e.target.name;
    const checked = e.target.checked;
    this.setState(state => {
      return {
        contestParticipantsGroups: {
          ...state.contestParticipantsGroups,
          [group]: checked
        }
      };
    });
  };

  getContestsDict = async courseID => {
    console.log("Getting the titles of the contests with courseID: ", courseID);
    const contestsDict = await this.props.state.session.call(
      "com.demo.get-contests-dictionaries",
      [this.props.state.DSID, this.state.authorId, courseID, this.props.state.language]
    );
    console.log("contestsDicts: ", contestsDict);
    if (contestsDict && contestsDict === this.state.contestsDict) return;
    this.setState({
      contestsDict,
      courseID,
      contestTitle: contestsDict[0]["contest_title"],
      courseTitle: contestsDict[0]["course_title"],
      info: contestsDict[0]["info"]
    });
    this.getTitlesProblemsAndInfo(contestsDict[0]["contest_title"]);
  };

  getTitlesProblemsAndInfo = contest => {
    console.log("Getting the problems of the contest: ", contest);
    console.log("*** contestsDict: ", this.state.contestsDict);
    const item = this.state.contestsDict.find(
      item => item.contest_title === contest
    );
    const problemsEnabled = {};
    const problems = item.problems;
    for (const problem of problems) {
      problemsEnabled[problem] = true;
    }
    console.log("*** problems", item.problems);
    console.log("*** info ", item.info);
    this.setState({
      problems,
      problemsEnabled,
      contestTitle: contest,
      info: item.info
    });
  };

  onChangeProblemsList = e => {
    console.log("onChangeProblemsList: ", e.target.id, e.target.checked);
    const checked = e.target.checked;
    const id = e.target.id;
    this.setState(state => ({
      problemsEnabled: { ...state.problemsEnabled, [id]: checked }
    }));
  };

  onToggleAllProblems = e => {
    const problemsEnabled = {};
    for (const key of this.state.problems) {
      problemsEnabled[key] = e.target.checked;
    }
    this.setState({ problemsEnabled });
  };

  onToggleAllProgrammingLanguages = e => {
    const programmingLanguagesEnabled = {};
    for (const lang of this.state.allowLanguages) {
      programmingLanguagesEnabled[lang] = e.target.checked;
    }
    this.setState({ programmingLanguagesEnabled });
  };

  onChangeAllowLanguagesList = e => {
    console.log(
      "onChangeAllowLanguagesList: ",
      e.target.id,
      e.target.checked,
      this.state.programmingLanguagesEnabled
    );
    const lang = e.target.name;
    const checked = e.target.checked;
    this.setState(state => {
      return {
        programmingLanguagesEnabled: {
          ...state.programmingLanguagesEnabled,
          [lang]: checked
        }
      };
    });
  };

  setContest = e => {
    console.log("Setting contest ...", e.target.value);
    this.getTitlesProblemsAndInfo(e.target.value);
  };

  getTitlesCourses = async () => {
    console.log("getTitlesCourses:  Loading the titles of the courses ...");
    console.log("Getting the titles of the courses");
    const courses = await this.props.state.session.call(
      "com.demo.get-titles-courses",
      [this.props.state.DSID, this.state.authorId, this.props.state.language]
    );
    console.log("getTitlesCourses *courses: ", courses);
    return courses;
  };

  onChangeDate = date => {
    console.log("New date: ", date);
    this.setState({ date });
  };

  setContestType = e => {
    console.log("setContestType: ", e.target.value);
    this.setState({ contestType: e.target.value });
  };

  setInfo = e => {
    console.log("Setting info with: ", e.target.value);
    this.setState({ info: e.target.value });
  };

  setContestDuration = e => {
    console.log("setContestDuration: ", e.target.value);
    const k = this.state.contestDuration[this.state.periodDuration][0];
    this.setState({
      timeDurationSec: e.target.value * k
    });
  };

  setPeriodDuration = e => {
    document.getElementById("contestDuration").value = null;
    this.setState({ periodDuration: e.target.value });
  };

  render() {
    if (!this.props.state.session) return null;
    console.log(
      "** render() ** contest creation form (session):",
      this.props.state.session
    );
    console.log("&&& render ", this.state.courses, this.props.state.language);

    return (
      <Form>
        <h2>Создание турнира</h2>
        <FormGroup row>
          <Label sm={2} for="author_id">
            Автор
          </Label>
          <Col sm={6}>
            <Input placeholder={this.state.author} readOnly></Input>
          </Col>
        </FormGroup>
        {!this.state.participantsGroups ? null : (
          <FormGroup row>
            <Label sm={2} for="participants">
              Участники турнира
            </Label>
            <Col sm={6}>
              {this.state.participantsGroups.map(group => (
                <InputGroup key={group[0]}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        name={group}
                        onChange={this.setContestParticipantsGroups}
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder={group[1]} readOnly></Input>
                </InputGroup>
              ))}
            </Col>
          </FormGroup>
        )}
        <FormGroup row>
          <Label sm={2} for="contest_type">
            Тип турнира
          </Label>
          <Col sm={6}>
            <Input
              onChange={this.setContestType}
              type="select"
              name="selectContestType"
              id="contest_type"
            >
              <option value="otbor">Практическая работа</option>
              <option value="labs">Лабораторная работа</option>
              <option value="olympic">Олімпіада</option>
              <option value="test">Контрольная работа</option>
              <option value="zachet">Зачётное задание</option>
              <option value="acm">Олимпиада ACM</option>
              <option value="acm_archive">Архив АСМ</option>
              <option value="classic_archive">Архив задач</option>
              <option value="exam">Экзамен</option>
            </Input>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2} for="courseTitle">
            Название курса
          </Label>
          <Col sm={6}>
            <Input
              onChange={this.onCourseChange}
              type="select"
              name="selectCourse"
              id="courseTitle"
            >
              {!this.state.courses
                ? null
                : this.state.courses.map(course => (
                    <option key={course.course_id} value={course.course_id}>
                      {course.course_title}
                    </option>
                  ))}
            </Input>
          </Col>
          {this.state.courses ? null : (
            <Col sm={4}>
              <Spinner color="warning" />
            </Col>
          )}
        </FormGroup>

        {!this.state.courses ? null : (
          <FormGroup row>
            <Label sm={2} for="contestTitle">
              Название турнира
            </Label>
            <Col sm={6}>
              <Input
                onChange={this.setContest}
                type="select"
                name="select"
                id="contestTitle"
              >
                {!this.state.contestsDict
                  ? null
                  : this.state.contestsDict.map(contest => (
                      <option key={contest.contest_title}>
                        {contest.contest_title}
                      </option>
                    ))}
              </Input>
            </Col>
          </FormGroup>
        )}
        {!this.state.problems ? null : (
          <FormGroup row>
            <Label sm={2} for="problems">
              Задачи турнира
            </Label>
            <Col sm={6}>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <Input
                      onChange={this.onToggleAllProblems}
                      addon
                      type="checkbox"
                      checked={Object.values(this.state.problemsEnabled).every(
                        x => x
                      )}
                    />
                  </InputGroupText>
                  <InputGroupText>Выбрать все</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {this.state.problems.map(problem => (
                <InputGroup key={problem}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        id={problem}
                        onChange={this.onChangeProblemsList}
                        addon
                        type="checkbox"
                        checked={this.state.problemsEnabled[problem]}
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <a href="" target="_blank">
                    <Input defaultValue={problem}></Input>
                  </a>
                </InputGroup>
              ))}
            </Col>
          </FormGroup>
        )}
        <FormGroup row>
          <Label sm={2} for="allow_languages">
            Разрешенные языки программирования
          </Label>
          <Col sm={6}>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <Input
                    onChange={this.onToggleAllProgrammingLanguages}
                    addon
                    type="checkbox"
                    checked={Object.values(
                      this.state.programmingLanguagesEnabled
                    ).every(x => x)}
                  />
                </InputGroupText>
                <InputGroupText>Выбрать все</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {!this.state.allowLanguages
              ? null
              : this.state.allowLanguages.map(lang => (
                  <InputGroup key={lang[0]}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <Input
                          name={lang}
                          onChange={this.onChangeAllowLanguagesList}
                          addon
                          type="checkbox"
                          checked={this.state.programmingLanguagesEnabled[lang]}
                        />
                      </InputGroupText>
                      <InputGroupText>{lang[1]}</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                ))}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2} for="info">
            info
          </Label>
          <Col sm={6}>
            <Input
              type="textarea"
              name="text"
              id="info"
              value={this.state.info}
              onChange={this.setInfo}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2} for="start_time">
            Начало турнира 
          </Label>
          <Col>
            <DatePicker
              className="pointer"
              selected={this.state.date}
              onChange={e => this.setState({ date: e })}
              showTimeSelect
              dateFormat="dd / MM / yyyy   H:mm "
              timeIntervals={15}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2} for="data">
            Продолжительность турнира
          </Label>
          <Col sm={6}>
            <InputGroup>
              <InputGroupAddon className="col-sm-12" addonType="append">
                <InputGroupText className="col-sm-4">
                  <Input
                    id="contestDuration"
                    onBlur={this.setContestDuration}
                    placeholder={
                      "Длительность турнира в " +
                      this.state.contestDuration[this.state.periodDuration][2]
                    }
                  />
                </InputGroupText>
                <InputGroupText>
                  <Input
                    onChange={this.setPeriodDuration}
                    type="select"
                    name="selectData"
                    id="data"
                    addon
                  >
                    {Object.entries(this.state.contestDuration).map(item => (
                      <option key={item[0]} value={item[0]}>{item[1][1]}</option>
                    ))}
                  </Input>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 5 }}>
            <Button onClick={this.createContest}>Создать турнир</Button>
          </Col>
        </FormGroup>
        <Modal
          showModal={this.state.showModal}
          isShowModal={this.isShowModal}
          messageModal={this.state.messageModal}
        />

        <style>
          {`
            h2 {
                text-align: center;
                margin-top: 50px;
                margin-bottom: 50px;
            }
            a input, .pointer {
                cursor: pointer;
            }
          `}
        </style>
      </Form>
    );
  }
}
