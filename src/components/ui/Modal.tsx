import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose() // click on the backdrop
      }}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-white text-gray-900 backdrop:bg-black/50 dark:bg-gray-900 dark:text-gray-100"
    >
      {open && (
        <div className="p-6">
          <h2 id="modal-title" className="mb-4 text-lg font-semibold">
            {title}
          </h2>
          {children}
        </div>
      )}
    </dialog>
  )
}
