import { Col, Button, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner } from 'reactstrap';

import 'moment/locale/uk' // or 'rc-datepicker/node_modules/moment/locale/fr.js' if you don't have it in your node_modules folder
import { DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';

import Datetime from 'react-datetime';

import Calend from 'rc-calendar';
import { now } from 'moment';



export default class extends React.Component {
    state = {
        author: null,
        contestType: 'otbor',
        courseTitle: null,
        contestTitle: null,
        problems: null,
        allowLanguages: null,
        startTime: null,
        contestParticipants: null,
        options: 4,
        data: null,
        info: null,
        date: new Date(),
        courses: null,
        contestsDict: null,
        excludedProblems: [],
        excludedAllowLanguages: [],
    }

    componentDidMount() {
        console.log('DIDMount open')
        if (!this.props.state.session) return
        this.getTitlesCourses()
            .then((courses) => console.log('DIDMount getTitlesCourses response: ', courses))
            .catch((e) => console.log('DIDMount getTitlesCourses error:', e)) 
    }

    componentDidUpdate(nextProps) {
        console.log('DidUpdate open', this.state.courses, 'language: ', this.props.state.language)
        if (!this.props.state.session) return
        console.log('this.state.courses', this.state.courses)
        console.log('this.props: ', this.props)
        console.log('nextProps: ',nextProps)
        console.log('************** state: ', this.state)
        if (this.state.courses && this.props===nextProps) {
            console.log('DidUpdate: no changes')
            return
        }
        this.getTitlesCourses()
            .then((courses) => {
                console.log('DidUpdate getTitlesCourses response: ', courses)
                if (courses === this.state.courses) return
                this.setState({courses})
            })
            .catch((e) => console.log('DidUpdate getTitlesCourses error:', e))
        console.log('DidUpdate: Loading the titles of the courses ...')
        console.log('DidUpdate exit', this.state.courses, 'session: ', this.props.state.language)
        if (this.state.allowLanguages) return
        this.getAllowLanguage()
            .then((allowLanguages) => {
                console.log('DidUpdate getAllowLanguage response: ', allowLanguages)
                if (this.state.allowLanguages === allowLanguages) return
                this.setState({allowLanguages})
            })
            .catch((e) => console.log('DidUpdate getAllowLanguage error:', e))
    }

    createContest = async () => {
        console.log('On click "Create contest"')
        let problems = this.state.problems.filter(x => !this.state.excludedProblems.includes(x));
        console.log('createContest problems: ', problems)
        let allowLanguages = this.state.allowLanguages.filter(x => !this.state.excludedAllowLanguages.includes(x));
        console.log('createContest allowLanguages:', allowLanguages)
        const res = await this.props.state.session.call('com.demo.create-contest', ['create-contest',])
        console.log('res: ', res)
    }

    getAllowLanguage = async () => {
        console.log('Getting allow language ...')
        const allowLanguages = await this.props.state.session.call('com.demo.get-allow-language', [])
        console.log('Allow language: ', allowLanguages)
        return allowLanguages
    }

    onCourseChange = (e) => {
        this.getContestsDict(e.target.value)
    }

    getContestsDict = async (courseID) => {
        console.log('Getting the titles of the contests with courseID: ', courseID)
        const contestsDict = await this.props.state.session.call('com.demo.get-contests-dictionaries', [courseID, this.props.state.language])
        console.log('contestsDicts: ', contestsDict)
        if (contestsDict && contestsDict === this.state.contestsDict) return
        this.setState({
            contestsDict,
            courseID,
            problems: contestsDict[0]['problems'],
            contestTitle: contestsDict[0]['contest_title'],
            courseTitle: contestsDict[0]['course_title'],
        })
    }

    getTitlesProblems = (contest) => {
        console.log('Getting the problems of the contest: ', contest)
        console.log('*** contestsDict: ', this.state.contestsDict)
        const problems = this.state.contestsDict.find(item => item.contest_title == contest).problems
        console.log('*** problems', problems)
        this.setState({
            problems,
            contestTitle: contest,
        })
    }

    onChangeProblemsList = (e) => {
        let excludedProblems = this.state.excludedProblems;
        console.log('onChangeProblemsList: ', e.target.id, e.target.checked)
        if (!e.target.checked) {
            excludedProblems.push(e.target.id)
        }
        else {
            let value = excludedProblems.indexOf(e.target.id)
            if (value !== -1) {
                excludedProblems.splice(value, 1)
            }
        }
        console.log('onChangeProblemsList excludedProblems: ', excludedProblems)
        this.setState({excludedProblems})
    }

    onChangeAllowLanguagesList = (e) => {
        console.log('onChangeAllowLanguagesList: ', e.target.id, e.target.checked)
        let excludedAllowLanguages = this.state.excludedAllowLanguages;
        if (!e.target.checked) {
            excludedAllowLanguages.push(e.target.id)
        }
        else {
            let value = excludedAllowLanguages.indexOf(e.target.id);
            if (value !== -1) {
                excludedAllowLanguages.splice(value, 1)
            }
        }
        console.log('onChangeAllowLanguagesList excludedAllowLanguages: ', excludedAllowLanguages)
        this.setState({excludedAllowLanguages})
    }

    setContest = (e) => {
        console.log('Setting contest ...', e.target.value)
        this.getTitlesProblems(e.target.value)
    }

    getTitlesCourses = async () => {
        console.log('getTitlesCourses:  Loading the titles of the courses ...')
        console.log('Getting the titles of the courses')
        const courses = await this.props.state.session.call('com.demo.get-titles-courses', [this.props.state.language,])
        console.log('getTitlesCourses *courses: ', courses)
        this.getContestsDict(courses[0].course_id)
        // this.setState ({courses})
        return courses
    }

    onChangeDate = (date) => {
        console.log('New date: ', date)
        this.setState({date})
    }

    setContestType = (e) => {
        console.log('setContestType: ', e.target.value)
        this.setState({contestType: e.target.value}) 
    }

    render() {
        if (!this.props.state.session) return null
        console.log('** render() ** contest creation form (session):', this.props.state.session)
        console.log('&&& render ', this.state.courses, this.props.state.language)

        return (
            <Form>
                <h2>Создание турнира</h2>
                <FormGroup row>
                    <Label sm={2} for="author_id">Автор</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="author_id" placeholder="автоподставка" />
                    </Col>            
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="contest_type">Тип турнира</Label>
                    <Col sm={6}>
                        <Input onChange={this.setContestType} type="select" name="select" id="contest_type">
                            <option value="otbor" >Практическая работа</option>
                            <option value="labs" >Лабораторная работа</option>
                            <option value="olympic" >Олімпіада</option>
                            <option value="test" >Контрольная работа</option>
                            <option value="zachet" >Зачётное задание</option>
                            <option value="acm" >Олимпиада ACM</option>
                            <option value="acm_archive" >Архив АСМ</option>
                            <option value="classic_archive" >Архив задач</option>
                            <option value="exam" >Экзамен</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="title">Название курса</Label>
                    <Col sm={6}>
                        <Input  onChange={this.onCourseChange} type="select" name="select" id="contest_title">                        
                            {this.state.courses === null ? null : this.state.courses.map((course) => (
                                <option key={course.course_id} value={course.course_id}>{course.course_title}</option>
                            ))}
                        </Input>
                    </Col>
                    {this.state.courses ? null : <Col sm={4}><Spinner color="warning" /></Col>}
                    
                </FormGroup>
                
                {this.state.courses === null ? null :
                    <FormGroup row>
                        <Label sm={2} for="contest_title">Название турнира</Label>
                        <Col sm={6}>
                            <Input onChange={this.setContest} type="select" name="select" id="contest_title">
                                {this.state.contestsDict === null ? null : this.state.contestsDict.map((contest) => (
                                    <option key={contest.contest_title}>{contest.contest_title}</option>
                                ))}
                            </Input>
                        </Col>
                    </FormGroup>
                }
                {this.state.problems === null ? null :
                    <FormGroup row>
                        
                        <Label sm={2} for="problems">Задачи турнира</Label>
                        
                        <Col sm={6}>
                            {this.state.problems.map((problem) => (
                                <InputGroup key={problem}>
                                    <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <Input id={problem} onChange={this.onChangeProblemsList} addon type="checkbox" defaultChecked />
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <a href="" target="_blank"><Input placeholder={problem}></Input></a>
                                </InputGroup>
                            ))}
                        </Col>
                    </FormGroup>
                }
                <FormGroup row>
                    <Label sm={2} for="allow_languages">Разрешенные языки программирования</Label>
                    <Col sm={6}>
                        {this.state.allowLanguages === null ? null : this.state.allowLanguages.map((lang) => (
                            <InputGroup key={lang}>
                                <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <Input id={lang} onChange={this.onChangeAllowLanguagesList} addon type="checkbox" defaultChecked />
                                </InputGroupText>
                                </InputGroupAddon>
                                <Input placeholder={lang}></Input>
                            </InputGroup>
                        ))}
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="start_time">Начало турнира</Label>
                    <Col sm={3}>
                        {/* <Input type="textarea" name="text" id="start_time" /> */}
                        <DatePickerInput 
                        onChange={this.onChangeDate}
                        value={this.state.date}
                        className='my-custom-datepicker-component'
                        // {...anyReactInputProps}
                        />
                    </Col>
                    <Col sm={3}>
                        {/* <Input type="textarea" name="text" id="start_time" /> */}
                        <DatePickerInput 
                        // onChange={onChange}
                        // value={date}
                        className='my-custom-datepicker-component'
                        // {...anyReactInputProps}
                        />
                    </Col>
                    

                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="participants">Участники турнира</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="participants" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="data">data</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="data" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="info">info</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="info" />
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