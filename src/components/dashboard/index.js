import React, {Component} from 'react';
import './styles.css';
import {Grid, Row, Col, Button, Media} from 'react-bootstrap'
import {getBalance} from "../utils";
import {withRouter, Redirect} from 'react-router-dom'
import Transaction from "../transaction";

let interval;


class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.onSubmitSend = this.onSubmitSend.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signOut = this.signOut.bind(this);

        this.state = {};

        const account = this.props.account;
        if (account) {
            const refreshBalance = async () => {
                this.setState({balance: await getBalance(this.props.account.address)})
            };

            refreshBalance();
            interval = setInterval(refreshBalance, 5000)
        }
    }

    componentWillUnmount() {
        clearInterval(interval)
    }

    onSubmitSend(event) {
        event.preventDefault();

        // console.log(this.addressTo.value);
        // console.log(this.amount.value)
    }



    handleChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    signOut() {
        sessionStorage.setItem('account', null);
        this.props.history.push('/')

    }

    render() {
        if (!this.props.account) {
            return (
                <Redirect to={'/'}/>
            )
        }

        const account = this.props.account;
        const balance = this.state.balance;

        const opt = {
            account,
            balance
        };

        return (
            <Grid className='Dashboard'>
                <Row>
                    <Col>
                        <Media>
                            <Media.Left>
                                Balance of {account.address}
                            </Media.Left>
                            <Media.Body></Media.Body>
                            <Media.Right>
                                <Button onClick={this.signOut}>Sign out</Button>

                            </Media.Right>
                        </Media>

                    </Col>
                </Row>
                {balance ? (
                    <Row>
                        <Col>
                            NEO: {balance.NEO}

                        </Col>
                        <Col>
                            GAS: {balance.GAS}

                        </Col>
                    </Row>
                ) : ''}
                <Row>
                    <Col>
                        <Transaction {...opt}/>
                    </Col>
                </Row>
                <Row>
                    <Col>

                    </Col>
                </Row>

            </Grid>
        )
    }


}

export default withRouter(Dashboard);
