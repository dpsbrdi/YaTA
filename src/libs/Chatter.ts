import * as _ from 'lodash'
import * as shortid from 'shortid'
import { UserState } from 'twitch-js'

import LogType from 'Constants/logType'
import base, { TwitchUserColorMap } from 'Styled/base'
import { Serializable } from 'Utils/typescript'

/**
 * Chatter class.
 */
export default class Chatter implements Serializable<SerializedChatter> {
  /**
   * Creates a potential chatter which represents a user with only its username known.
   * @param username - The chatter username.
   * @return The potential chatter.
   */
  public static createPotentialChatter(username: string) {
    return new Chatter({
      badges: null,
      'badges-raw': '',
      color: null,
      'display-name': username,
      emotes: null,
      id: shortid.generate(),
      'message-type': LogType.Chat,
      mod: false,
      subscriber: false,
      'tmi-sent-ts': Date.now().toString(),
      'user-id': shortid.generate(),
      'user-type': null,
      username: username.toLowerCase(),
    })
  }

  public id: string
  public color: string | null
  public userName: string
  public isMod: boolean
  private displayName: string
  private showUserName: boolean
  private ignored: boolean = false
  private isSelf: boolean
  private isBroadcaster: boolean

  /**
   * Creates a new chatter instance.
   * @class
   * @param userstate - The associated user state.
   */
  constructor(userstate: UserState) {
    this.displayName = userstate['display-name']
    this.id = userstate['user-id']
    this.userName = userstate.username
    this.color = this.sanitizeDefaultColor(userstate.color)
    this.isBroadcaster = _.has(userstate.badges, 'broadcaster')
    this.isMod = userstate.mod || this.isBroadcaster
    this.showUserName = this.displayName.toLocaleLowerCase() !== this.userName.toLocaleLowerCase()
    this.isSelf = userstate['user-id'] === 'self'
  }

  /**
   * Generates a random color for the chatter.
   * @return The new random color.
   */
  public generateRandomColor() {
    const color = _.sample(base.chatters) || null

    this.color = color

    return color
  }

  /**
   * Serializes a chatter.
   * @return The serialized chatter.
   */
  public serialize() {
    return {
      color: this.color,
      displayName: this.displayName,
      id: this.id,
      ignored: this.ignored,
      isBroadcaster: this.isBroadcaster,
      isMod: this.isMod,
      isSelf: this.isSelf,
      showUserName: this.showUserName,
      userName: this.userName,
    }
  }

  /**
   * Sanitizes Twitch default colors if necessary.
   * @param  color - The color to sanitize.
   * @return The sanitized color.
   */
  private sanitizeDefaultColor(color: string | null) {
    if (_.isNil(color)) {
      return color
    }

    return _.get(TwitchUserColorMap, color, color)
  }
}

/**
 * Serialized chat message.
 */
export type SerializedChatter = {
  color: string | null
  displayName: string
  id: string
  ignored: boolean
  isBroadcaster: boolean
  isMod: boolean
  isSelf: boolean
  showUserName: boolean
  userName: string
}
