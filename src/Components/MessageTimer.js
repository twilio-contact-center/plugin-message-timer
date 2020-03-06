import React from 'react';

export default class MessageTimer extends React.Component {
  constructor(props) {
    super(props);

    // Instantiate the state
    this.state = {
      timeSinceLastInbound: this.getTimeSinceLastInbound(),
    }
  }

  /**
   * Builtin React method that gets called once this component has mounted.
   * We're using it to start the timer.
   */
  componentDidMount() {
    this.timer = setInterval(this.setTimeSinceLastInbound.bind(this), 1000);
  }

  /**
   * Builtin React method that gets called whenever this component is updated.
   * We're using it to detect chatChannel changes and kick off a recalculation
   */
  componentDidUpdate(prevProps, prevState, snapshop) {
    let newChatChannel = !prevProps.chatChannel && this.props.chatChannel;
    let lostChatChannel = prevProps.chatChannel && !this.props.chatChannel;
    let changedChatChannel = prevProps.chatChannel && this.props.chatChannel && this.props.chatChannel.messages.length !== prevProps.chatChannel.messages.length
    if (newChatChannel || lostChatChannel || changedChatChannel) {
      this.setTimeSinceLastInbound();
    }
  }

  /**
   * Buildin React method that getc called when this component is unmounted.
   * We're using it to clear the timer (if it exists)
   */
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * Retrieves the time (in seconds) since the last inbound message
   */
  getTimeSinceLastInbound() {
    // If there's no chatChannel, return undefined early
    if (!this.props.chatChannel) {
      return undefined
    }

    // Create an array of all inbound messages
    let inboundMessages = this.props.chatChannel.messages.filter((message) => {
      return message.isFromMe === false;
    });

    // Pull the last message in the array, and calculate+return the time difference
    if (inboundMessages.length > 0) {
      let lastInboundMessage = inboundMessages[inboundMessages.length - 1];
      let timeDiff = Math.round((new Date() - lastInboundMessage.source.timestamp) / 1000);
      return timeDiff;
    } else {
      return undefined
    }
  }

  /**
   * Finds the time since the last inbound message, and sets that on this
   * component's state
   */
  setTimeSinceLastInbound() {
    let timeSinceLastInbound = this.getTimeSinceLastInbound();

    if (this.state.timeSinceLastInbound !== timeSinceLastInbound) {
      this.setState({
        timeSinceLastInbound: timeSinceLastInbound
      });
    }
  }

  /**
   * Builtin React method for rendering this component
   */
  render() {
    if (this.state.timeSinceLastInbound) {
      let style = {
        margin: "2px 0",
        fontSize: "12px",
      }

      if (this.state.timeSinceLastInbound >= 60) {
        style.color = "red";
      }

      let timeSinceLastInboundHrs = Math.floor(this.state.timeSinceLastInbound / (60 * 60));
      let timeSinceLastInboundMin = Math.floor((this.state.timeSinceLastInbound - timeSinceLastInboundHrs * (60 * 60)) / 60);
      let timeSinceLastInboundSec = this.state.timeSinceLastInbound - (timeSinceLastInboundMin * 60) - (timeSinceLastInboundHrs * 60 * 60)

      let hrsString = timeSinceLastInboundHrs > 0 ? timeSinceLastInboundHrs.toString().padStart(2, "0") + ":" : ""
      let minString = timeSinceLastInboundMin > 0 ? timeSinceLastInboundMin.toString().padStart(2, "0") + ":" : ""
      let secString = timeSinceLastInboundSec.toString().padStart(2, "0")
      let endString = timeSinceLastInboundMin > 0 ? "" : "s"

      return <div style={style}>{hrsString}{minString}{secString}{endString}</div>
    } else {
      return ""
    }
  }
}