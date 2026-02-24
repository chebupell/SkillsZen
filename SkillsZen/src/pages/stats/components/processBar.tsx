const subjects = [
  {
    title: 'JavaScript',
    icon: 'JS',
    progress: 3,
    total: 4,
    color: '#f7f305',
  },
  {
    title: 'TypeScript',
    icon: 'TS',
    progress: 2,
    total: 4,
    color: '#639ae8',
  },
  {
    title: 'Algorithms',
    icon: 'Al',
    progress: 1,
    total: 4,
    color: '#8df9a1',
  },
]

function ProcessBar() {
  return (
    <div className="processBar">
      {subjects.map((subject) => {
        const percent = (subject.progress / subject.total) * 100
        return (
          <div key={subject.title} className="progressSubject">
            <div
              className="iconSubject"
              style={{
                backgroundColor: `${subject.color}`,
              }}
            >
              {subject.icon}{' '}
            </div>
            <div className="textContainer">
              <span>{subject.title}</span>
              <p>10 random questions</p>
            </div>
            <div className="progressContainer">
              <span>
                {subject.progress} / {subject.total}
              </span>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: `${subject.color}`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProcessBar
