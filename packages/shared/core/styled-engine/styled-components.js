import React from 'react'
import styled, {
  css,
  withTheme,
  injectGlobal,
  ThemeProvider,
} from 'styled-components'

export default styled
export { css, withTheme, injectGlobal, ThemeProvider }

export const patchStyledAPI = (StyledComponent, BaseComponent) => {
  // Patch extend
  Object.defineProperty(StyledComponent, 'extend', {
    get() {
      return (...args) => {
        const NewStyledComponent = styled(StyledComponent)`
          &&& {
            ${css(...args)};
          }
        `
        patchStyledAPI(NewStyledComponent, StyledComponent)
        return NewStyledComponent
      }
    },
  })

  // Patch withComponent
  const originalWithComponent = StyledComponent.withComponent.bind(
    StyledComponent,
  )
  StyledComponent.withComponent = component => {
    const CustomComponent = props => <BaseComponent as={component} {...props} />
    const NewStyledComponent = originalWithComponent(CustomComponent)
    patchStyledAPI(NewStyledComponent, BaseComponent)
    return NewStyledComponent
  }
}
