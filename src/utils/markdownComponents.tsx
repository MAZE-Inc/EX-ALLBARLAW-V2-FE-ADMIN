import { ComponentPropsWithoutRef } from 'react'

export const markdownComponents = {
  p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => <p {...props}>{children}</p>,
  ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul style={{ listStyle: 'disc' }} {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => <li {...props}>{children}</li>,
}
