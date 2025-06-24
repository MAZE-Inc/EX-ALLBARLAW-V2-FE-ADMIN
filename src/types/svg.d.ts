import React from 'react'
import * as Icons from '@/assets/svgs'

export type KeyOfIcon = keyof typeof Icons

declare module '*.svg' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default value
}
