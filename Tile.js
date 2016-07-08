import React, { Component } from 'react'

import {
  Dimensions,
  View,
  Text,
  TouchableHighlight,
} from 'react-native'

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')
export const TILE_SIZE = HEIGHT / 3
export const TILE_SIZE_PROPS = { width: TILE_SIZE, height: TILE_SIZE }

export class TileText extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    return (
      <Text
        ref={component => this._root = component}
        {...this.props}
        style={{ fontFamily: 'Asap-Bold', fontSize: 30, color: 'white' }}
      />
    )
  }
}

export default class Tile extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    let { style, grow, backgroundColor, children, ...props } = this.props
    let Komponent = props.onPress ? TouchableHighlight : View

    return (
      <Komponent
        ref={component => this._root = component}
        style={[style, {
          width: TILE_SIZE, height: TILE_SIZE,
          alignItems: 'center',
          justifyContent: 'center',
          flex: grow ? 1 : null,
          backgroundColor
        }]}
        {...props}
      >
        {children}
      </Komponent>
    )
  }
}
