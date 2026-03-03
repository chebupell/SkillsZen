import CreateButton from './buttons/createButton'

type PageTitleProps = {
  buttonText: string
  onButtonClick?: () => void
  buttonDisabled?: boolean
  children?: React.ReactNode
}

function PageTitle({
  buttonText,
  onButtonClick,
  buttonDisabled = false,
  children,
}: PageTitleProps) {
  return (
    <div className="flex items-center justify-start gap-4 w-full">
      <CreateButton
        text={buttonText}
        onClick={onButtonClick}
        disabled={buttonDisabled}
        className="px-4 py-2 rounded-lg border hover:bg-gray-100"
      />

      <div className="flex flex-col justify-center items-start">{children}</div>
    </div>
  )
}

export default PageTitle
