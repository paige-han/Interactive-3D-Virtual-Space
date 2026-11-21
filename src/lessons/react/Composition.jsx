// React foundations — Composition with `children`
// A wrapper component doesn't need to know what it wraps:
// whatever is placed between its tags arrives as `props.children`.

function FancyBorder({ color, children }) {
  return (
    <div style={{ border: `2px solid ${color}`, borderRadius: 12, padding: 16, margin: 4 }}>
      {children}
    </div>
  )
}

function WelcomeDialog() {
  return (
    <FancyBorder color="#3b82f6">
      <h3 style={{ margin: '0 0 4px' }}>Welcome</h3>
      <p style={{ margin: 0 }}>Thank you for visiting our spacecraft!</p>
    </FancyBorder>
  )
}

export default function Composition() {
  return (
    <div className="stack">
      <WelcomeDialog />
      <FancyBorder color="#10b981">
        <p style={{ margin: 0 }}>The same border can wrap any content.</p>
      </FancyBorder>
    </div>
  )
}
