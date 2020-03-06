import React from 'react';

export default class MessageTimer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeSinceLastInbound: this.getTimeSinceLastInbound(),
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.setTimeSinceLastInbound.bind(this), 1000);
  }

  getTimeSinceLastInbound() {
    let inboundMessages = this.props.chatChannel.messages.filter((message) => {
      return message.isFromMe === false;
    });

    if (inboundMessages.length > 0) {
      let lastInboundMessage = inboundMessages[inboundMessages.length - 1];
      let timeDiff = Math.round((new Date() - lastInboundMessage.source.timestamp) / 1000);
      return timeDiff;
    }
  }

  setTimeSinceLastInbound() {
    let timeSinceLastInbound = this.getTimeSinceLastInbound();

    if (this.state.timeSinceLastInbound !== timeSinceLastInbound) {
      this.setState({
        timeSinceLastInbound: timeSinceLastInbound
      }, () => {
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshop) {
    if (this.props.chatChannel.messages.length !== prevProps.chatChannel.messages.length) {
      this.setTimeSinceLastInbound();
    }
  }

  render() {
    if (this.state.timeSinceLastInbound) {
      let style = {
        margin: "2px 0",
        fontSize: "12px",
      }

      if (this.state.timeSinceLastInbound > 60) {
        style.color = "red";
      }

      let timeSinceLastInboundHrs = Math.floor(this.state.timeSinceLastInbound / (60 * 60));
      let timeSinceLastInboundMin = Math.floor((this.state.timeSinceLastInbound - timeSinceLastInboundHrs * (60 * 60)) / 60);
      let timeSinceLastInboundSec = this.state.timeSinceLastInbound - (timeSinceLastInboundMin * 60) - (timeSinceLastInboundHrs * 60 * 60)

      return <div style={style}>{timeSinceLastInboundHrs.toString().padStart(2, "0")}:{timeSinceLastInboundMin.toString().padStart(2, "0")}:{timeSinceLastInboundSec.toString().padStart(2, "0")}</div>
    } else {
      return ""
    }
  }
}