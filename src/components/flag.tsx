interface FlagProps {
  code: string   // ISO 3166-1 alpha-2 lowercase, e.g. 'us', 'gb-eng'
  size?: number  // diameter in px
}

export function Flag({ code, size = 24 }: FlagProps) {
  return (
    <span
      className={`fi fis fi-${code}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        verticalAlign: 'middle',
      }}
    />
  )
}
