const sizeMap = {
  sm: "md-18",
  md: "md-24",
  lg: "md-36",
  xl: "md-48",
}

const mapSize = (size) => sizeMap[size]

const populateClassName = (size) => `material-icons ${mapSize(size)}`

const Icon = ({ name, size = "md", style }) => (
  <span className={populateClassName(size)} style={style}>
    {name}
  </span>
)

export default Icon
