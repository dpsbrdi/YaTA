import styled from 'styled-components'

import { withSCProps } from 'Utils/react'
import { ifProp } from 'Utils/styled'

/**
 * FlexLayout component.
 */
const FlexLayout = withSCProps<Props, HTMLElement>(styled.section)`
  display: flex;
  flex-direction: ${ifProp('vertical', 'column', 'row')};
  height: 100%;
`

export default FlexLayout

/**
 * React Props.
 */
type Props = {
  vertical?: boolean
}