# Chakra UI Theme

This is a Chakra UI theme generated with [Hypertheme Editor](https://hyperthe.me).

## Usage
Put the entire directory inside the `src/` folder of your project.

Use it in inside your ChakraProvider
```tsx
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

function App() {
  return (
    <ChakraProvider theme={theme}>
      ...rest of code
    </ChakraProvider>
  )
}

export default App
```
