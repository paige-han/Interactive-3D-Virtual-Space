import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import { ALL_LESSONS, DAYS } from './registry.js'

const SOURCE_BASE = 'https://github.com/paige-han/Interactive-3D-Virtual-Space/blob/main/src/lessons/'

function initialId() {
  const hash = window.location.hash.slice(1)
  return ALL_LESSONS.some((l) => l.id === hash) ? hash : ALL_LESSONS[0].id
}

export default function LessonsApp() {
  const [activeId, setActiveId] = useState(initialId)
  const lesson = ALL_LESSONS.find((l) => l.id === activeId)
  const index = ALL_LESSONS.indexOf(lesson)

  useEffect(() => {
    window.history.replaceState(null, '', `#${activeId}`)
  }, [activeId])

  const { Component } = lesson

  return (
    <div className="lessons">
      <aside className="sidebar">
        <a className="back" href="./">← Back to demo</a>
        <h1>Course lessons</h1>
        <p className="muted">Exercises from an interactive 3D web course, completed and cleaned up.</p>
        {DAYS.map((day) => (
          <section key={day.title}>
            <h2>{day.title}</h2>
            <ol>
              {day.lessons.map((l) => (
                <li key={l.id}>
                  <button className={l.id === activeId ? 'active' : ''} onClick={() => setActiveId(l.id)}>
                    {l.title}
                  </button>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </aside>

      <main className="lesson">
        <header>
          <div>
            <span className="eyebrow">Lesson {index + 1} of {ALL_LESSONS.length}</span>
            <h2>{lesson.title}</h2>
            <p>{lesson.summary}</p>
          </div>
          <div className="actions">
            <a href={SOURCE_BASE + lesson.file} target="_blank" rel="noreferrer">View code ↗</a>
            <button disabled={index === 0} onClick={() => setActiveId(ALL_LESSONS[index - 1].id)}>← Prev</button>
            <button disabled={index === ALL_LESSONS.length - 1} onClick={() => setActiveId(ALL_LESSONS[index + 1].id)}>Next →</button>
          </div>
        </header>

        <div className={lesson.kind === '3d' ? 'stage stage-3d' : 'stage stage-dom'}>
          {lesson.kind === '3d' ? (
            <>
              <Leva hidden={false} collapsed={false} titleBar={{ title: 'Controls' }} />
              <Canvas key={lesson.id} shadows dpr={[1, 2]} camera={{ position: lesson.camera, fov: 45 }}>
                <Suspense fallback={null}>
                  <Component />
                </Suspense>
              </Canvas>
            </>
          ) : (
            <>
              <Leva hidden />
              <div className="dom-card"><Component key={lesson.id} /></div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
