import './index.css'

const ProjectShowCase = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="pro-container">
      <img src={imageUrl} alt={name} className="img" />
      <p className="name">{name}</p>
    </li>
  )
}

export default ProjectShowCase
