type ProgressBarProps = {
  percent: number
  color?: string
}

function ProgressBar({ percent, color = "#3b82f6" }: ProgressBarProps) {
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-500 ease-in-out rounded-full"
        style={{
          width: `${percent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )
}

export default ProgressBar
