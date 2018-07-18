import React, {Component} from 'react';
import './styles.css';
import {FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap'
import {wallet} from "@cityofzion/neon-js";
import {sendTransaction} from "../utils";
import Datetime from 'react-datetime'
import moment from 'moment'


class Transaction extends Component {
    constructor(props) {
        super(props);
        this.getAddressValidationState = this.getAddressValidationState.bind(this);
        this.getAmountValidationState = this.getAmountValidationState.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDatetimeChange = this.handleDatetimeChange.bind(this);
        this.getDateValidationState = this.getDateValidationState.bind(this);

        this.state = {};
    }

    getAddressValidationState() {
        const address = this.state.to;
        if (!address) return null;

        try {
            if (wallet.isScriptHash(address) !== true) {
                return 'error'
            }
        } catch (e) {

            // console.log('The address you entered was not valid.');
            return 'error'
        }

        return 'success';
    }

    getAmountValidationState() {
        const neo = parseInt(this.state.neo, 10);
        const balance = this.props.balance && parseInt(this.props.balance.NEO, 10);

        if (!neo || !balance) return;

        if (neo <= balance) return 'success';
        if (neo > balance) return 'error';

        return null;
    }

    getDateValidationState() {
        const datetime = this.state.datetime;
        console.log(moment(datetime).isValid(), moment(datetime))
        return datetime && moment(datetime).isValid();
    }

    handleChange(e) {
        let {id, value} = e.target;


        this.setState({[id]: value});
    }

    handleDatetimeChange(datetime) {
        if (typeof datetime === 'string') this.dateValid = false;
        else if (typeof  datetime === 'object') this.dateValid = true;

        this.setState({datetime})
    }


    async onSubmit(e) {
        e.preventDefault();
        this.setState({submitted: true});

        const {to, neo, datetime} = this.state;
        const {WIF, address} = this.props.account;


        const opt = {
            to,
            neo: parseInt(neo, 10),
            wif: WIF,
            from: address
        };
        console.log(opt, this.props);


        setTimeout(async () => {
            // alert(moment().format('H:m:s SSS '));
            await sendTransaction(opt)

        }, datetime.unix() * 1000 - Date.now())



    }

    render() {

        const {neo, to, datetime} = this.state;

        let datetimeClass = '';

        const amountState = this.getAmountValidationState();
        const addressState = this.getAddressValidationState();

        const formValidation = amountState === 'success' && addressState === 'success' && this.dateValid;

        if (this.dateValid) datetimeClass = 'has-success';
        else if (datetime && !this.dateValid) datetimeClass = 'has-error';


        return (

            <form onSubmit={this.onSubmit} className="Scheduler">
                <h2>Schedule transaction</h2>
                <FormGroup
                    controlId="to"
                    validationState={addressState}>
                    <ControlLabel>Script hash</ControlLabel>
                    <FormControl
                        disabled={this.state.submitted}
                        onChange={this.handleChange}
                        type="text"
                        placeholder="Script hash"/>
                </FormGroup>

                <FormGroup
                    controlId="neo"
                    validationState={amountState}>
                    <ControlLabel>Amount</ControlLabel>
                    <FormControl
                        disabled={this.state.submitted}
                        onChange={this.handleChange}
                        type="number"
                        placeholder="NEO"/>
                </FormGroup>

                <div className={datetimeClass}>
                    <label htmlFor="datetime" className="control-label">Datetime</label>

                    <Datetime
                        className={datetimeClass}
                        inputProps={{disabled: this.state.submitted}}
                        onChange={this.handleDatetimeChange}
                        timeFormat="HH:mm"
                        id="datetime"
                    />
                </div>

                <Button type='submit'
                        disabled={(!neo || !to || !datetime) || !formValidation || this.state.submitted}>Send</Button>
            </form>

        );
    }
}

export default Transaction;
