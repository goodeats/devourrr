import React, { Component } from 'react';
import List from './List';
import NewListForm from './NewListForm';
import axios from 'axios';

class ListsContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      lists: []
    }
    this.addNewList = this.addNewList.bind(this)
    this.removeList = this.removeList.bind(this)
  }

  componentDidMount() {
    // https://stackoverflow.com/questions/44932650/running-a-react-rails-app-locally
    axios.get('api/v1/lists.json')
    .then(response => {
      console.log(response)
      this.setState({
        lists: response.data
      })
    })
    .catch(error => console.log(error))
  }

  addNewList(title, excerpt){
    console.log(title, excerpt);
    axios.post('/api/v1/lists', { list: {title, excerpt} })
    .then(response => {
        console.log(response)
        const lists = [ ...this.state.lists, response.data ]
        this.setState({lists})
    })
    .catch(error => {
        console.log(error)
    })
  }

  removeList(id) {
    axios.delete('/api/v1/lists/' + id )
    .then(response => {
      const lists = this.state.lists.filter(
        list => list.id !== id
      )
      this.setState({lists})
    })
    .catch(error => console.log(error))
  }

  render() {
    return (
      <div className="Lists-container">
        <div>
          <NewListForm onNewList={this.addNewList} />
        </div>
        {this.state.lists.map(list => {
          return (
            <List
              list={list}
              key={list.id}
              onRemoveList={this.removeList} />
          )
        })}
      </div>
    )
  }
}
export default ListsContainer;
