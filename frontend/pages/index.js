import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Input } from "reactstrap";

import autobahn from "autobahn";

import ContestForm from "../components/contest-creation-form";

class Index extends React.Component {
  state = {
    DSID: null,
    session: null,
    language: "ru"
  };

  componentDidMount() {
    console.log("Hi");

    const wamp = new autobahn.Connection({
      url: "ws://127.0.0.1:8080/ws",
      realm: "demo",

      // url: "wss://dots.org.ua/wamp",
      // realm: "dots",

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
      const DSID = document.cookie.match(/DSID=[^;]+/)[0].split('=')[1]
      console.log("cookie: ", DSID);
      this.setState({ session, DSID });
      console.log("new session open: ", session);
    };

    wamp.open();
  }

  setLanguage = e => {
    this.setState({ language: e.target.value });
    console.log("language set ", e.target.value);
  };

  render() {
    if (!this.state.session) return null;
    return (
      <div>
        <div>
          <Col sm={1}>
            <Input
              onChange={this.setLanguage}
              type="select"
              name="select"
              id="lang"
            >
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
    );
  }
}

export default Index;
