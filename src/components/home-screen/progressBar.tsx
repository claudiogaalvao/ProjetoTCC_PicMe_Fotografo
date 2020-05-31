import React, { Component } from "react";
import { Icon } from 'native-base';
import ProgressCircle from 'react-native-progress-circle'
import { Alert, Text } from "react-native";

interface Props {
    percent: number;
    onRequestTimeout: () => void;
}

interface State {
    percent: number
}

class ProgressBar extends Component<Props> {

    state: State = {
        percent: this.props.percent
    }

    componentDidMount() {
        
        setInterval(() => {
            this.setState({
                percent: this.state.percent - 1
            })
            if(this.state.percent === 0) {
                if (this.props.onRequestTimeout) {
                    this.props.onRequestTimeout();
                }
            }
        }, 100)
    }

    render() {

        return(
            <ProgressCircle
            percent={this.state.percent}
            radius={32}
            borderWidth={5}
            color="#fff"
            shadowColor="#224CB4"
            bgColor="#224CB4"
            >
                <Icon type="FontAwesome5" name="user" style={{ color: 'white', fontSize: 26 }}></Icon>
                
            </ProgressCircle>
        );

    }

}

export default ProgressBar;