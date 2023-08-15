import { extendTheme } from '@chakra-ui/react'
import foundations from './foundations'

const direction = 'ltr'

const config = {
  useSystemColorMode: false,
  initialColorMode: 'light',
  cssVarPrefix: 'chakra',
}

export const theme = {
  direction,
  ...foundations,
  config,
}

export default extendTheme(theme)
