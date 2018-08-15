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
  }

  render() {
    return (
      <div className="Lists-container">
        <div>
          <NewListForm onNewList={this.addNewList} />
        </div>
        {this.state.lists.map(list => {
          return (
            <List list={list} key={list.id} />
          )
        })}
      </div>
    )
  }
}
export default ListsContainer;
