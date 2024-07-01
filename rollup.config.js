import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { readdir, unlink } from 'fs/promises'
import { join } from 'path'
import materialSymbols from 'rollup-plugin-material-symbols'

const cleanWWW = async () => {
  return {
    name: 'clean-www', // this name will show up in warnings and errors
    generateBundle: async () => {
      try {
        const files = await readdir('www')
        for (const file of files) {
          if (
            file.endsWith('.js') &&
            !file.includes('sw.js') &&
            !file.includes('workbox') &&
            !file.includes('wallet-connect')
          )
            await unlink(join('www', file))
        }
      } catch (error) {}
      return
    }
  }
}

export default [
  {
    input: ['./src/shell.ts'],
    output: [
      {
        format: 'es',
        dir: './www',
        sourceMap: true
      }
    ],
    plugins: [
      cleanWWW(),
      materialSymbols({
        placeholderPrefix: 'symbol'
      }),
      nodeResolve(),
      typescript()
    ],
    external: ['./wallet-connect.js']
  },
  {
    input: ['./src/wallet-connect.ts'],
    output: [
      {
        format: 'es',
        dir: './www',
        sourceMap: true
      }
    ],
    plugins: [commonjs(), nodeResolve({ browser: true }), typescript()]
  }
]
