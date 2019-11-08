import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Text,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Spinner
} from "reactstrap";

import "moment/locale/uk"; // or 'rc-datepicker/node_modules/moment/locale/fr.js' if you don't have it in your node_modules folder
import { DatePickerInput } from "rc-datepicker";
import "rc-datepicker/lib/style.css";

import Datetime from "react-datetime";

import Calend from "rc-calendar";
import { now } from "moment";

export default class extends React.Component {
  state = {
    author: 1007,
    contestType: "otbor",
    courseTitle: null,
    contestTitle: null,
    problems: null,
    allowLanguages: null,
    startTime: null,
    contestParticipantsGroups: [],
    options: 4,
    data: null,
    info: "информация",
    date: new Date(),
    courses: null,
    contestsDict: null,
    excludedProblems: [],
    programmingLanguagesEnabled: {},
    problemsEnabled: {},
    participantsGroups: [],
    showParticipantsGroupsSpinner: true
  };

  componentDidMount() {
    console.log("DIDMount open");
    if (!this.props.state.session) return;
    this.getParticipantsGroups(this.state.author)
      .then(participantsGroups => {
        this.setState({
          participantsGroups,
          showParticipantsGroupsSpinner: false
        });
      })
      .catch(e =>
        console.log(
          "componentDidMount: setting the contestParticipans error -- ",
          e
        )
      );
    this.getTitlesCourses()
      .then(courses =>
        console.log("DIDMount getTitlesCourses response: ", courses)
      )
      .catch(e => console.log("DIDMount getTitlesCourses error:", e));
  }

  componentDidUpdate(nextProps) {
    console.log(
      "DidUpdate open",
      this.state.courses,
      "language: ",
      this.props.state.language
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
        if (courses === this.state.courses) return;
        this.setState({ courses });
      })
      .catch(e => console.log("DidUpdate getTitlesCourses error:", e));
    console.log("DidUpdate: Loading the titles of the courses ...");
    console.log(
      "DidUpdate exit",
      this.state.courses,
      "session: ",
      this.props.state.language
    );
    if (this.state.contestParticipansGroup && this.props === nextProps) return;
    this.getParticipantsGroups(this.state.author)
      .then(participantsGroups => {
        console.log(
          "DidUpdate getParticipantsGroups response: ",
          participantsGroups
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

  createContest = async () => {
    console.log('On click "Create contest"');
    let problems = this.state.problems.filter(
      x => this.state.problemsEnabled[x]
    );
    console.log("createContest problems: ", problems);
    let allowLanguages = this.state.allowLanguages.filter(
      lang => this.state.programmingLanguagesEnabled[lang]
    );
    console.log("createContest allowLanguages:", allowLanguages);
    const res = await this.props.state.session.call("com.demo.create-contest", [
      "create-contest"
    ]);
    console.log("res: ", res);
  };

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

  onAuthorChange = e => {
    console.log("Setting the ContestParticipantsGroups with: ", e.target.value);
    this.setState({ showParticipantsGroupsSpinner: true });
    this.getParticipantsGroups(e.target.value)
      .then(participantsGroups =>
        this.setState({
          participantsGroups,
          showParticipantsGroupsSpinner: false
        })
      )
      .catch(e =>
        console.log(
          "onAuthorChange: setting the contestParticipans error -- ",
          e
        )
      );
  };

  setAuthor = author => {
    this.setState({ author });
  };

  getParticipantsGroups = async author => {
    console.log("getParticipantsGroups value: ", author);
    const participantsGroups = await this.props.state.session.call(
      "com.demo.get-participants-groups",
      [author]
    );
    console.log("participantsGroups", participantsGroups);
    if (author !== this.state.author) {
      this.setAuthor(author);
    }
    return participantsGroups;
  };

  setContestParticipantsGroups = e => {
    console.log(
      "Setting the setContestParticipantsGroups with: ",
      e.target.checked,
      e.target.id
    );
    let contestParticipantsGroups = this.state.contestParticipantsGroups;
    if (e.target.checked) {
      contestParticipantsGroups.push(e.target.id);
    } else {
      let value = contestParticipantsGroups.indexOf(e.target.id);
      if (value !== -1) {
        contestParticipantsGroups.splice(value, 1);
      }
    }
    this.setState({ contestParticipantsGroups });
  };

  getContestsDict = async courseID => {
    console.log("Getting the titles of the contests with courseID: ", courseID);
    const contestsDict = await this.props.state.session.call(
      "com.demo.get-contests-dictionaries",
      [courseID, this.props.state.language]
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
      item => item.contest_title == contest
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
      [this.props.state.language]
    );
    console.log("getTitlesCourses *courses: ", courses);
    this.getContestsDict(courses[0].course_id);
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
            <Input
              type="textarea"
              name="text"
              id="author_id"
              placeholder={this.state.author}
              onBlur={this.onAuthorChange}
            >
              {this.state.author}
            </Input>
          </Col>
        </FormGroup>
        {!this.state.participantsGroups ? null : (
          <FormGroup row>
            <Label sm={2} for="participants">
              Участники турнира
            </Label>
            <Col sm={6}>
              {this.state.participantsGroups.map(group => (
                <InputGroup key={group}>
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <Input
                        id={group}
                        onChange={this.setContestParticipantsGroups}
                        addon
                        type="checkbox"
                      />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input placeholder={group}></Input>
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
          <Col sm={3}>
            {/* <Input type="textarea" name="text" id="start_time" /> */}
            <DatePickerInput
              onChange={this.onChangeDate}
              value={this.state.date}
              className="my-custom-datepicker-component"
              // {...anyReactInputProps}
            />
          </Col>
          <Col sm={3}>
            {/* <Input type="textarea" name="text" id="start_time" /> */}
            <DatePickerInput
              // onChange={onChange}
              // value={date}
              className="my-custom-datepicker-component"
              // {...anyReactInputProps}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2} for="data">
            data
          </Label>
          <Col sm={6}>
            <Input type="textarea" name="text" id="data" />
          </Col>
        </FormGroup>
        <FormGroup check row>
          <Col sm={{ size: 10, offset: 5 }}>
            <Button onClick={this.createContest}>Создать турнир</Button>
          </Col>
        </FormGroup>

        <style>
          {`
                        h2 {
                            text-align: center;
                            margin-top: 50px;
                            margin-bottom: 50px;
                        }
                        a input {
                            cursor: pointer;
                        }
                    `}
        </style>
      </Form>
    );
  }
}
