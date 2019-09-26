import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Input } from 'reactstrap';


import autobahn from "autobahn";

import ContestForm from '../components/contest-creation-form'


class Index extends React.Component {
    state = {
        session: null,
        language: 'ru',
    }

    componentDidMount() {
        console.log('Hi')

        const wamp = new autobahn.Connection({
            url: "ws://localhost:8080/ws",
            realm: "demo",
            //authmethods: ["ticket"],
            //authid: "demo-frontend",
            //onchallenge: (_session, method, _extra) => {
            //  if (method === "ticket") {
            //    return wampDemoSecret;
            //  }
            //  throw "unsupported challenge method";
            //},
            retry_if_unreachable: true,
            max_retries: Number.MAX_SAFE_INTEGER,
            max_retry_delay: 10
          });

        // wamp.onopen = async session => {
        //     await this.setState({session: session})
        //     console.log('open: ', session)

        //     function onevent1(args) {
        //         console.log("Got event:", args);
        //     }
        //     await session.subscribe('com.demo.test-subscribe', onevent1);
        // }

        wamp.onopen = session => {
            console.log('new session')
            this.setState({session: session})
            console.log('open: ', session)
        };

        wamp.open();
    }

    setLanguage = (e) => {
        this.setState({language: e.target.value})
        console.log('language set ', e.target.value)
    }

    render() {
        return (
        <div>
            <div>
                <Col sm={1}>
                    <Input onChange={this.setLanguage} type="select" name="select" id="lang">
                        <option>ru</option>
                        <option>ua</option>
                        <option>en</option>
                    </Input>
                </Col>
            </div>
            <ContestForm state={this.state} />

            <style>
                {`
                    body {
                        margin: 50px;
                    }
                    #lang {
                        text-transform: uppercase;
                    }
                `}
            </style>

        </div>
        )
    }
}

export default Index