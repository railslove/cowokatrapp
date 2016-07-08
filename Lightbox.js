import React, { Component } from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Dimensions,
} from 'react-native'

import Tile from './Tile'

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
const springSettings = { tension: 30, friction: 7 }

class Overlay extends Component {
  state = {
    progress: new Animated.Value(0)
  }

  onClose() {
    Animated.spring(
      this.state.progress,
      { toValue: 0, ...springSettings }
    ).start(() => {
      this.props.close()
    })
  }

  componentDidMount() {
    Animated.spring(
      this.state.progress,
      { toValue: 1, ...springSettings }
    ).start()
  }

  render() {
    return (
      <Modal transparent>
        <Animated.View
          style={{
            left: this.state.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [this.props.origin.x, 0]}
            ),
            top: this.state.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [this.props.origin.y, 0]}
            ),
            width: this.state.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [this.props.origin.width, WIDTH]}
            ),
            height: this.state.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [this.props.origin.height, HEIGHT]}
            ),
            overflow: 'hidden',
          }}
        >
          <View style={{ width: WIDTH, height: HEIGHT }}>
            {this.props.children(() => this.onClose())}
          </View>
        </Animated.View>
      </Modal>
    )
  }
}

export default class Lightbox extends Component {
  state = {
    isOpen: false,
    origin: {}
  }

  openModal() {
    this._root.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isOpen: true,
        origin: {
          width,
          height,
          x: px,
          y: py
        }
      })
    })
  }

  closeModal() {
    this.setState({ isOpen: false })
  }

  render() {
    return this.state.isOpen
      ? (
        <View ref={component => this._root = component}>
          <Tile backgroundColor='black' />

          <Overlay origin={this.state.origin} close={() => this.closeModal()}>
            {close => this.props.renderContent(close)}
          </Overlay>
        </View>
      ) : (
        <View ref={component => this._root = component}>
          <TouchableHighlight onPress={() => this.openModal()}>
            {React.Children.only(this.props.children)}
          </TouchableHighlight>
        </View>
      )
  }
}
