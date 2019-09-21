import 'bootstrap/dist/css/bootstrap.min.css';

import autobahn from "autobahn";

import ContestForm from '../components/contest-creation-form'


class Index extends React.Component {
    state = {
        session: null,
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

        wamp.onopen = async session => {
            await this.setState({session: session})
            console.log('open: ', session)

            function onevent1(args) {
                console.log("Got event:", args);
            }
            await session.subscribe('com.demo.test-subscribe', onevent1);
        }

        wamp.open();
    }

    sendCall = async () => {
        console.log('On click "Call <test-python>"')
        const res = await this.state.session.call("com.demo.test-python", ['data-from-python',])
        console.log('res: ', res)
    }


    // sendPublish = () => {
    //     console.log('On click "Send publication"')
    //     this.state.session.publish("com.demo.test-subscribe", ["qweqwe",])
    // }

    render() {
        return (
        <div>
            <ContestForm session={this.state.session} />
            <button onClick={this.sendCall}>Call "test-python"</button>
            {/* <button onClick={this.createContest}>Create contest</button> */}

            <style>
                {`
                    body {
                        margin: 50px;
                    }
                `}
            </style>

        </div>
        )
    }
}

export default Index