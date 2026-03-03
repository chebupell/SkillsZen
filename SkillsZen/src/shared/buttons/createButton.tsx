export type ButtonProps = {
  text: string
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

function CreateButton({
  text,
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}

export default CreateButton
