'use client'

import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000 // 5 segundos, más razonable

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type Action =
  | { type: 'ADD_TOAST'; toast: ToasterToast }
  | { type: 'UPDATE_TOAST'; toast: Partial<ToasterToast> & { id: string } }
  | { type: 'DISMISS_TOAST'; toastId?: string }
  | { type: 'REMOVE_TOAST'; toastId?: string }

interface State {
  toasts: ToasterToast[]
}

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case 'DISMISS_TOAST':
      if (action.toastId) scheduleRemove(action.toastId)
      else state.toasts.forEach((t) => scheduleRemove(t.id))
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          action.toastId === undefined || t.id === action.toastId
            ? { ...t, open: false }
            : t
        ),
      }
    case 'REMOVE_TOAST':
      if (!action.toastId) return { ...state, toasts: [] }
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
    default:
      return state
  }
}

// Helper para schedulear la eliminación
function scheduleRemove(toastId: string) {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: 'REMOVE_TOAST', toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Creates a toast notification.
 * @param {Omit<ToasterToast, 'id'>} props - The properties of the toast notification.
 * @returns {{ id: string, dismiss: () => void, update: (updateProps: Partial<ToasterToast>) => void }}
 * @example
 * const { id, dismiss, update } = toast({
 *   title: 'Hello World',
 *   description: 'This is a test',
 *   action: <Button onClick={() => update({ title: 'Updated!' })}>Update</Button>
 * })
 * dismiss() // Dismiss the toast
 * update({ title: 'Updated!' }) // Update the toast
 */
/*******  e7319d05-0f49-4c52-ad36-aa1c77fa31a9  *******/
export function toast(props: Omit<ToasterToast, 'id'>) {
  const id = genId()
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })
  const update = (updateProps: Partial<ToasterToast>) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...updateProps, id } })

  dispatch({
    type: 'ADD_TOAST',
    toast: { ...props, id, open: true, onOpenChange: (open) => !open && dismiss() },
  })

  return { id, dismiss, update }
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}
