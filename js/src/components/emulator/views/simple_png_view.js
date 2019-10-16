/*
 * Copyright 2019 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import PropTypes from "prop-types";
import React, { Component } from "react";

/**
 * A view on the emulator that is generated by requesting a screenshot at a given interval. Beware that
 * these screenshots can arrive out of order, so the ui experience could be a little odd at times.
 *
 * Note: This is very expensive, and is merely here to showcase how you could make an interactive UI
 * using gRPC.
 *
 */
export default class EmulatorPngView extends Component {
  static propTypes = {
    emulator: PropTypes.object, // emulator service  width: PropTypes.number,
    height: PropTypes.number,
    refreshRate: PropTypes.number
  };

  static defaultProps = {
    width: 1080,
    height: 1920,
    refreshRate: 1
  };

  state = {
    png: ""
  };

  componentDidMount() {
    const { refreshRate } = this.props;
    this.updateView();
    this.timerID = setInterval(
      () => this.updateView(),
      Math.round(1000 / refreshRate)
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  /* Makes a grpc call to get a screenshot */
  updateView() {
    /* eslint-disable */
    var request = new proto.google.protobuf.Empty();
    var self = this;
    this.props.emulator.getScreenshot(request).on("data", response => {
      // Update the image with the one we just received.
      self.setState({
        png: "data:image/jpeg;base64," + response.getImage_asB64()
      });
    });
  }

  handleDrag = e => {
    e.preventDefault();
  };

  render() {
    const { width, height } = this.props;
    return (
      <img
        style={{ "pointerEvents": "all" }}
        src={this.state.png}
        width={width}
        height={height}
        onDragStart={this.handleDrag}
      />
    );
  }
}
