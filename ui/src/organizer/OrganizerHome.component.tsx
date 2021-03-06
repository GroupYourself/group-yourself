import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as H from 'history';
import { AlertType } from '../alert/Alert.component.js';
import axios from 'axios';
import { AxiosError } from '../utils/axios-error.js';
import config from '../utils/config';

export interface OrganizerHomeProps extends RouteComponentProps<{
   collectionId: string,
}> {
   alert: (type: AlertType, message: string) => void;
   history: H.History;
}

interface Collection {
   id: number;
   name: string,
   joinAllowed: boolean
}

export default class OrganizerHome extends React.Component<OrganizerHomeProps, any> {

   state = {
      collections: [] as Array<Collection>,
      createNewCollection: false,
      newCollection: {
         name: '',
         startingYear: new Date().getFullYear()
      }
   };

   loadData() {
      axios.get(`${config.SERVER_URL}/org/collection`,
         {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         })
         .then((res: { data: string }) => {
            this.setState({ collections: res.data })
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response?.data || 'Failed to establish connection to server');
         });
   }

   componentDidMount() {
      if (!localStorage.getItem('token')) {
         this.props.history.push('/')
      }

      this.loadData();
   }

   editCollectionSetting(collectionId: number) {
      return (e: React.MouseEvent<HTMLButtonElement>) => {
         this.props.history.push(`/organizer/${collectionId}`);
      };
   }

   onChangeNewCollectionName = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newCollection: {
            name: e.target.value,
            startingYear: this.state.newCollection.startingYear
         }
      })
   }

   onChangeNewCollectionStartingYear = (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
         newCollection: {
            name: this.state.newCollection.name,
            startingYear: e.target.value
         }
      })
   }

   onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();

      axios.post(`${config.SERVER_URL}/org/collection`, this.state.newCollection,
         {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
         })
         .then((res) => {
            this.props.alert('success', 'Successfully created new collection!');
            this.setState({
               createNewCollection: false,
               newCollection: {
                  name: '',
                  startingYear: 0
               }
            });
            this.loadData();
         }).catch((error: AxiosError) => {
            this.props.alert('error', error.response.data || 'Creation failed');
         });
   }

   render() {
      return (
         <div>
            {/* Create new collection button */}
            {this.state.createNewCollection ?
               (<button onClick={() => {
                  this.setState({ createNewCollection: false })
               }}>
                  Cancel
               </button>) :
               (<button onClick={() => {
                  this.setState({ createNewCollection: true })
               }}>
                  Create new collection
               </button>)
            }

            {/* Create new collection form */}
            {this.state.createNewCollection &&
               (<div className='form-container'>
                  <fieldset>
                     <legend>Create new collection</legend>

                     <form onSubmit={this.onSubmit}>
                        <div className='form-group'>
                           <label>Name</label>
                           <input
                              type='text'
                              value={this.state.newCollection.name}
                              onChange={this.onChangeNewCollectionName}
                              className='form-control' />
                        </div>
                        <div className='form-group'>
                           <label>Starting year</label>
                           <input
                              type='number'
                              value={this.state.newCollection.startingYear}
                              onChange={this.onChangeNewCollectionStartingYear}
                              className='form-control' />
                        </div>
                        <div className='form-group'>
                           <input type='submit' value='Create' className='btn btn-submit' />
                        </div>
                     </form>
                  </fieldset>
               </div>)
            }

            {/* Collections list */}
            {this.state.collections.map((c) => {
               return (
                  <div>
                     <p>
                        {c.name}
                     </p>
                     <p>
                        {c.joinAllowed ?
                           'Auto-enrollment allowed' :
                           'Auto-enrollment not allowed'
                        }
                     </p>
                     <button
                        onClick={this.editCollectionSetting(c.id)}>
                        Edit
                        </button>
                  </div>
               );
            })}
         </div>)
   }
}