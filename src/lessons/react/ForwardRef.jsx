// React foundations — forwardRef
// A parent can't attach a ref to a custom component by default.
// forwardRef passes the ref through to a DOM element inside it.
import { forwardRef, useRef } from 'react'

const CustomInput = forwardRef(function CustomInput(props, ref) {
  return <input ref={ref} className="fancy-input" placeholder="I'm inside CustomInput" {...props} />
})

export default function ForwardRef() {
  const refInput = useRef(null)

  return (
    <div className="row">
      <CustomInput ref={refInput} />
      <button onClick={() => refInput.current.focus()}>Focus</button>
    </div>
  )
}
