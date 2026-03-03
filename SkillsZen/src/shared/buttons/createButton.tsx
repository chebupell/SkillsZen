export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { 
text: string; 
}

function CreateButton({
  text,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button className={className} {...props}>
      {text}
    </button>
  )
}

export default CreateButton
