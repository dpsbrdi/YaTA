import { Classes, Colors } from '@blueprintjs/core'
import _ from 'lodash'
import { Component } from 'react'
import { connect } from 'react-redux'

import SettingsView from 'components/SettingsView'
import Spinner from 'components/Spinner'
import { setShouldReadChangelog } from 'store/ducks/app'
import { setVersion } from 'store/ducks/settings'
import { ApplicationState } from 'store/reducers'
import styled, { theme } from 'styled'

/**
 * Changelog component.
 */
const Changelog = styled.div`
  font-size: 0.8rem;
  line-height: 1.2rem;

  & summary {
    cursor: pointer;
    font-size: 1.5em;
    font-weight: 600;
    margin-top: 30px;
  }

  & h1,
  & h2,
  .${Classes.DARK} & h1,
  .${Classes.DARK} & h3 {
    font-weight: 600;
    margin: 0;
    padding: 0;
  }

  & h1,
  .${Classes.DARK} & h1 {
    font-size: 1.2rem;
    line-height: 40px;
    margin-top: 20px;

    &:first-child {
      margin-top: 0;
    }

    & + h3 {
      margin-top: 15px;
    }
  }

  & h3,
  .${Classes.DARK} & h3 {
    border: 0;
    font-size: 1rem;
    line-height: 25px;
    margin: 20px 0 15px 0;

    &::first-letter {
      margin-right: 5px;
    }
  }

  & code,
  .${Classes.DARK} & code {
    background: ${theme('changelog.background')};
    border-radius: 3px;
    box-shadow: inset 0 0 0 1px ${theme('changelog.shadow')};
    color: ${Colors.GRAY1};
    font-size: 1em;
    padding: 2px 5px;
  }

  .${Classes.DARK} & code {
    background: ${theme('changelog.dark')};
    color: ${Colors.GRAY5};
  }

  & ul ul,
  .${Classes.DARK} & ul ul {
    padding-left: 16px;
  }
`

/**
 * React State.
 */
const initialState = { isThemeConfirmationOpened: false, changelog: undefined as Optional<string> }
type State = Readonly<typeof initialState>

/**
 * SettingsChangelog Component.
 */
class SettingsChangelog extends Component<Props, State> {
  public state: State = initialState

  /**
   * Lifecycle: componentDidMount.
   */
  public async componentDidMount() {
    if (_.isNil(this.state.changelog)) {
      // @ts-ignore
      const changelogUrl = (await import('../CHANGELOG.md')).default
      const marked = (await import('marked')).default

      const response = await fetch(changelogUrl)
      let changelog = await response.text()
      changelog = marked(changelog)

      this.setState(() => ({ changelog }))

      this.props.setVersion(process.env.REACT_APP_VERSION)
      this.props.setShouldReadChangelog(false)
    }
  }

  /**
   * Renders the component.
   * @return Element to render.
   */
  public render() {
    const { changelog } = this.state

    if (_.isNil(changelog)) {
      return (
        <SettingsView>
          <Spinner />
        </SettingsView>
      )
    }

    return (
      <SettingsView>
        <Changelog dangerouslySetInnerHTML={{ __html: changelog }} />
      </SettingsView>
    )
  }
}

export default connect<{}, DispatchProps, {}, ApplicationState>(null, { setVersion, setShouldReadChangelog })(
  SettingsChangelog
)

/**
 * React Props.
 */
interface DispatchProps {
  setShouldReadChangelog: typeof setShouldReadChangelog
  setVersion: typeof setVersion
}

/**
 * React Props.
 */
type Props = DispatchProps
