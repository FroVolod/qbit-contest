import { Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default class extends React.Component {

    createContest = async () => {
        console.log('On click "Create contest"')
        const res = await this.props.session.call("com.demo.create-contest", ["create-contest",])
        console.log('res: ', res)
    }

    render() {
        console.log('contest creation form (session):', this.props.session)
        return (
        <Form>
            <h2>Создание турнира</h2>
            <FormGroup row>
                <Label sm={2} for="author_id">Автор</Label>
                <Col sm={10}>
                    <Input type="textarea" name="text" id="author_id" placeholder="автоподставка" />
                </Col>            
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="title">Название курса</Label>
                <Col sm={10}>
                    <Input type="select" name="select" id="contest_title">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Input>
                </Col>
                </FormGroup>
            <FormGroup row>
                <Label sm={2} for="contest_title">Название турнира (видимый после выбора курса)</Label>
                <Col sm={10}>
                    <Input type="select" name="select" id="contest_title">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </Input>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="allow_languages">Разрешенные языки программирования</Label>
                <Col sm={10}>
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
                <Col sm={10}>
                    <Input type="textarea" name="text" id="start_time" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="participants">Участники турнира</Label>
                <Col sm={10}>
                    <Input type="textarea" name="text" id="participants" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="options">options</Label>
                <Col sm={10}>
                    <Input type="textarea" name="text" id="options" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="data">data</Label>
                <Col sm={10}>
                    <Input type="textarea" name="text" id="data" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label sm={2} for="info">info</Label>
                <Col sm={10}>
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
                        margin-bottom: 50px; 
                    }
                `} 
            </style>

        </Form>
        );
    }
}