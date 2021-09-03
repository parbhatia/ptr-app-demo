import File from "./File"

const FileManager = ({ files, label }) => {
  return (
    <div className="p-1 space-y-2">
      {files.map((f, i) => (
        <File key={`${label}-${i}`} {...f} />
      ))}
    </div>
  )
}

export default FileManager
