import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectShowCase from './components/ProjectShowCase'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstant = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
// Replace your code here
class App extends Component {
  state = {
    proList: [],
    apiStatus: apiStatusConstant.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getAllProject()
  }

  getAllProject = async () => {
    this.setState({apiStatus: apiStatusConstant.loading})
    const {category} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(eachPro => ({
        id: eachPro.id,
        name: eachPro.name,
        imageUrl: eachPro.image_url,
      }))
      this.setState({
        proList: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  onChangeInput = event => {
    this.setState({category: event.target.value}, this.getAllProject)
  }

  renderLoader = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" height={50} width={50} color="#00BFFF" />
    </div>
  )

  successView = () => {
    const {proList} = this.state
    return (
      <div className="app-container">
        <ul className="list-container">
          {proList.map(pro => (
            <ProjectShowCase key={pro.id} projectDetails={pro} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-heading">Oops! Something Went Wrong</h1>
      <p className="fail-para">
        We cannot seem to find the page you looking for
      </p>
      <button type="button" className="fail-btn" onClick={this.getAllProject}>
        Retry
      </button>
    </div>
  )

  apiStatusBasedRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.loading:
        return this.renderLoader()
      case apiStatusConstant.success:
        return this.successView()
      case apiStatusConstant.failure:
        return this.renderFailure()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state
    return (
      <div className="bg-container">
        <nav className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </nav>
        <ul className="option-container">
          <select
            className="option"
            value={category}
            onChange={this.onChangeInput}
          >
            {categoriesList.map(eachOption => (
              <option value={eachOption.id} key={eachOption.id}>
                {eachOption.displayText}
              </option>
            ))}
          </select>
        </ul>
        {this.apiStatusBasedRender()}
      </div>
    )
  }
}
export default App
