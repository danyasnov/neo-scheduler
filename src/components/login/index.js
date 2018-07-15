import React, {Component} from 'react';
import './styles.css';
import {Grid, Row, Col, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import {wallet} from "@cityofzion/neon-js";
import {wifLogin} from "../utils";

class Login extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // this.props.onLogin(wifLogin('L1ovC6R8PfMSSdWfRM9ojQ6rnSf5U1ALP9gPSRPEF8YZJwgT8abV'));
        // this.props.history.push('/dashboard');

        this.state = {};
    }

    getValidationState() {
        const wif = this.state.wif;
        if (!wif) return null;
        if (wallet.isWIF(wif) || wallet.isPrivateKey(wif)) return 'success';
        else return 'error'
    }

    handleChange(e) {
        this.setState({wif: e.target.value});
    }

    async handleSubmit(event) {
        event.preventDefault();

        this.setState({submitted: true});

        if (this.getValidationState() !== 'success') {
            return this.props.notify({
                type: 'error',
                text: 'That is not a valid private key'
            })
        }


        const account = wifLogin(this.state.wif);

        this.props.onLogin(account);

        this.props.history.push('/dashboard')
    }

    render() {

        return (
            <Grid className="Login">

                <Row>
                    <Col>
                        <form onSubmit={this.handleSubmit}>
                            <FormGroup
                                controlId="wif"
                                validationState={this.state.submitted && this.getValidationState()}>
                                <ControlLabel>Login using a private key:</ControlLabel>
                                <FormControl
                                    type="password"
                                    placeholder="Enter your private key here (WIF)"
                                    onChange={this.handleChange}/>
                                <FormControl.Feedback/>
                            </FormGroup>
                            <div className='form-cnt'>
                                <Button type="submit" disabled={!this.state.wif}>Login</Button>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Grid>

        );
    }
}

export default Login;
