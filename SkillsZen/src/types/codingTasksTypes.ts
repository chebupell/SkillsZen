export interface CodingTask {
  id: string
  name: string
  order: number
  status?: string
  description?: string
}

export type UserProgressMap = Record<string, 'completed' | 'in_progress' | string>

export interface TaskData {
  text: string
  initial_code: string
  tests: string[]
  type: string
}

export interface ExecutionResult {
  output: string
  error: string
  success: boolean
}


export interface ProgressBarProps {
  progress: number
  isCompleted?: boolean
  showStats?: boolean
  size?: 'sm' | 'md' | 'lg'
}
