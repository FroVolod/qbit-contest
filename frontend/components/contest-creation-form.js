import { Col, Button, Form, FormGroup, Label, Input, Spinner } from 'reactstrap';

export default class extends React.Component {
    state = {
        courses: null,
        course: '',
        contests: null,
        contest: '',
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
    }

    createContest = async () => {
        console.log('On click "Create contest"')
        const res = await this.props.state.session.call('com.demo.create-contest', ['create-contest',])
        console.log('res: ', res)
    }

    getTitlesContests = async (e) => {
        console.log('Getting the titles of the contests')
        const res = await this.props.state.session.call('com.demo.get-titles-contests', [e.target.value, this.props.state.language])
        console.log('res: ', res)
        this.setState({contests: res})
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
        const contests = await this.props.state.session.call('com.demo.get-titles-contests', [courses[0], this.props.state.language])
        console.log('contests: ', contests)
        this.setState ({courses: courses, contests: contests})
        console.log('### courses: ', this.state.courses)
        console.log('### contests: ', this.state.contests)
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
                        <Input  onChange={this.getTitlesContests} type="select" name="select" id="contest_title">                        
                            {this.state.courses === null ? null : this.state.courses.map((course) => (
                                <option key={course}>{course}</option>
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
                                            <option key={contest}>{contest}</option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>
                }
                <FormGroup row>
                    <Label sm={2} for="allow_languages">Разрешенные языки программирования</Label>
                    <Col sm={6}>
                        <Input type="select" name="selectMulti" id="allow_languages" multiple>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
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