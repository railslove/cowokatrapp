import React, { Component } from 'react'
import chunk from 'lodash/chunk'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native'
import randomColor from 'randomcolor'
import { VibrancyView } from 'react-native-blur'

import accounting from 'accounting'
accounting.settings.currency.format = "%v %s"

import Lightbox from './Lightbox'
import Tile, { TileText, WIDTH, HEIGHT, TILE_SIZE, TILE_SIZE_PROPS } from './Tile'

const color = seed => randomColor({ count: 1, luminosity: 'bright', seed })

StatusBar.setHidden(true)

class UserPage extends Component {
  render() {
    let { avatar_url, first_name, calculated_budget } = this.props
    calculated_budget = parseFloat(calculated_budget)

    return (
      <View style={{ flexDirection: 'column' }}>

        <View style={{ flexDirection: 'row' }}>
          <UserTile {...this.props} />

          <Tile onPress={() => this.props.close()} backgroundColor='#00CB7A' grow>
            <TileText>Kleines Heißgetränk</TileText>
          </Tile>

          <Tile onPress={() => this.props.close()} backgroundColor='#17BC7A' grow>
            <TileText>Großes Heißgetränk</TileText>
          </Tile>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Tile onPress={() => this.props.close()} backgroundColor='#FFAE00'>
            <TileText>
              {accounting.formatMoney(calculated_budget, "€")}
            </TileText>
          </Tile>

          <Tile onPress={() => this.props.close()} backgroundColor='#4DB2EC' grow>
            <TileText>Kuchen</TileText>
          </Tile>

          <Tile onPress={() => this.props.close()} backgroundColor='#2D9CDB' grow>
            <TileText>Kaltgetränk</TileText>
          </Tile>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <Tile onPress={() => this.props.close()} backgroundColor='#EC5840' grow={calculated_budget >= 0}>
            <TileText>Zurück</TileText>
          </Tile>

          {calculated_budget < 0 && [
            <Tile key='foo' onPress={() => this.props.close()} backgroundColor='#7D8A9A' grow>
              <TileText>
                Teil bezahlen
              </TileText>
            </Tile>,

            <Tile key='bar' onPress={() => this.props.close()} backgroundColor='#7D8A9A' grow>
              <TileText>
                Alles bezahlen
              </TileText>
            </Tile>
          ]}
        </View>

      </View>
    )
  }
}

class UserTile extends Component {
  setNativeProps(nativeProps) {
    this._root.setNativeProps(nativeProps)
  }

  render() {
    let { first_name, avatar_url, email } = this.props
    avatar_url = avatar_url.replace(/^\/\//, 'https://')

    return (
      <Tile style={{ backgroundColor: color(email) }} ref={component => this._root = component}>
        <Image
          style={{ ...TILE_SIZE_PROPS, }}
          source={{ uri: avatar_url }}
          resizeMode='cover'
        >
          <View style={styles.nameContainer}>
            <View style={{ borderRadius: 15, overflow: 'hidden' }}>
              <VibrancyView blurType='light' style={styles.name}>
                <Text style={{ color: 'black', fontFamily: 'Asap-Regular' }}>{first_name}</Text>
              </VibrancyView>
            </View>
          </View>
        </Image>
      </Tile>
    )
  }
}

class App extends Component {
  state = {
    users: []
  }

  componentDidMount() {
    this.fetchUsers().then(users => (
      this.setState({ users })
    ))
  }

  fetchUsers() {
    return fetch('https://cowokatra.apps.railslabs.com/users.json')
      .then(response => response.json())
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
        >
          {chunk(this.state.users, 12).map((users, index) => (
            <View style={styles.container} key={index}>
                {users.map(user => (
                  <Lightbox renderContent={close => <UserPage close={close} {...user} />} key={user.id}>
                    <UserTile {...user} />
                  </Lightbox>
                ))}
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 'black'
  },
  nameContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  name: {
    backgroundColor: 'transparent',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 12,
  }
})

AppRegistry.registerComponent('cowokatrapp', () => App)
