import { Col, Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

export default class extends React.Component {
    state = {
        courses: null,
        course: '',
        contests: null,
        contest: '',
        allowLanguages: null,
    }

    componentDidMount() {
        console.log('DIDMount open')
        if (!this.props.state.session) return
        this.getTitlesCourses()
    }

    componentDidUpdate(nextProps) {
        console.log('DidUpdate open', this.state.courses, 'language: ', this.props.state.language)
        if (!this.props.state.session) return
        console.log('this.state.courses', this.state.courses)
        console.log('this.props: ', this.props)
        console.log('nextProps: ',nextProps)
        if (this.state.courses && this.props===nextProps) return
        this.getTitlesCourses()
        console.log('DidUpdate: Loading the titles of the courses ...')
        console.log('DidUpdate exit', this.state.courses, 'session: ', this.props.state.language)
        this.getAllowLanguage()
    }

    createContest = async () => {
        console.log('On click "Create contest"')
        const res = await this.props.state.session.call('com.demo.create-contest', ['create-contest',])
        console.log('res: ', res)
    }

    getAllowLanguage = async () => {
        console.log('Getting allow language ...')
        const allowLanguages = await this.props.state.session.call('com.demo.get-allow-language', [])
        console.log('Allow language: ', allowLanguages)
        this.setState({allowLanguages})
    }

    onCourseChange = async (e) => {
        await this.getTitlesContests(e.target.value)
    }

    getTitlesContests = async (contestId) => {
        console.log('Getting the titles of the contests with contestId: ', contestId)
        const contests = await this.props.state.session.call('com.demo.get-titles-contests', [contestId, this.props.state.language])
        console.log('contests_dicts: ', contests)
        this.setState({contests})
        console.log('getTitlesContests: ', this.state.contests)
    }

    setContest = async (e) => {
        console.log('Setting contest ...', e.target.value)
    }

    getTitlesCourses = async () => {
        console.log('getTitlesCourses:  Loading the titles of the courses ...')
        console.log('Getting the titles of the courses')
        const courses = await this.props.state.session.call('com.demo.get-titles-courses', [this.props.state.language,])
        console.log('courses: ', courses)
        this.getTitlesContests(courses[0].course_id)
        this.setState ({courses})
    }

    render() {
        if (!this.props.state.session) return null
        console.log('contest creation form (session):', this.props.state.session)
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
                                        {this.state.contests === null ? null : this.state.contests.map((contest) => (
                                            <option key={contest.contest_title}>{contest.contest_title}</option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>
                }
                <FormGroup row>
                    <Label sm={2} for="allow_languages">Разрешенные языки программирования</Label>
                    <Col sm={6}>
                        <Input type="select" name="selectMulti" id="allow_languages" multiple>
                            {this.state.allowLanguages === null ? null : this.state.allowLanguages.map((lang) => (
                                <option selected key={lang[1]}>{lang[1]}</option>
                            ))}
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="start_time">Начало турнира</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="start_time" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="participants">Участники турнира</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="participants" />
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label sm={2} for="options">options</Label>
                    <Col sm={6}>
                        <Input type="textarea" name="text" id="options" />
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
                    `} 
                </style>

            </Form>
        );
    }
}