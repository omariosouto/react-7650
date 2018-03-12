import React, { Component, Fragment } from 'react';
import Cabecalho from './components/Cabecalho'
import Dashboard from './components/Dashboard'
import Widget from './components/Widget'
import TrendsArea from './components/TrendsArea'
import Tweet from './components/Tweet'

class App extends Component {
  constructor() {
    super()

    this.state = {
      novoTweet: '',
      tweets: [],
      carregando: true
    }

    console.log(this.state.novoTweet.length)
    // Com a arrow function, nao precisa disso: this.adicionaTweet = this.adicionaTweet.bind(this)
  }

  componentDidMount() { // Pega depois que componente montou
    console.log('didMount')
    fetch('http://twitelum-api.herokuapp.com/tweets')
      .then(resposta => resposta.json())
      .then(tweets => {
        this.setState({
          tweets: tweets,
          carregando: false
        })
      })
  }

  // componentWillMount() { // Registra antes que o componente monte
  //   console.log('WillMount')
  //   // Redux // Lib de Event Buzz ou PubSub
  //   setInterval(() => { // [[Gambiarra alert, use um socket :) ]]
  //     fetch('http://twitelum-api.herokuapp.com/tweets')
  //       .then(resposta => resposta.json())
  //       .then(tweets => {
  //         this.setState({
  //           tweets: tweets
  //         })
  //       })
  //   }, 5000)
  // }

  isTweetInvalido = () => {
    return this.state.novoTweet.length > 140
  }

  adicionaTweet = (event) => {
    event.preventDefault()

    if(this.isTweetInvalido() || this.state.novoTweet.length === 0) {
      console.log('O tweet ta invalido')
    } else {
      console.log('deve adicionar o tweet')
      fetch('http://twitelum-api.herokuapp.com/tweets', {
        method: 'POST',
        body: JSON.stringify(
            { conteudo: this.state.novoTweet, login: 'omariosouto' }
        )
      })
      .then( (response) => response.json() )
      .then( (tweetDoServer) => {
        console.log(tweetDoServer)
        this.setState({
          tweets: [tweetDoServer, ...this.state.tweets],
          novoTweet: ''
        })
      })

    }
  }

  render() {
    return (
      <Fragment>
        <Cabecalho usuario="@omariosouto" />
        <div className="container">
            <Dashboard>
                <Widget>
                    <form onSubmit={ this.adicionaTweet } className="novoTweet">
                        <div className="novoTweet__editorArea">
                            <span className={
                                `novoTweet__status ${ this.isTweetInvalido()
                                  ? 'novoTweet__status--invalido' : ''  }` }>
                          
                              { this.state.novoTweet.length }/140
                            </span>
                            <textarea
                              onChange={ (event) => {
                                  this.setState({ novoTweet: event.target.value })
                                  // Não fazemos isso: this.state.novoTweet = event.target.value
                              } }
                              value={ this.state.novoTweet }
                              className="novoTweet__editor"
                              placeholder="O que está acontecendo?"></textarea>
                        </div>
                        <button
                          disabled={ this.isTweetInvalido() ? true : false }
                          type="submit"
                          className="novoTweet__envia">
                          Tweetar
                        </button>
                    </form>
                </Widget>
                <Widget>
                    <TrendsArea />
                </Widget>
            </Dashboard>
            <Dashboard posicao="centro">
                <Widget>
                    <div className="tweetsArea">
                        { this.state.carregando ? 'Carregando os tweets, perae!' : '' }
                        { this.state.tweets.length ? '' : <div>Crie seu tweet</div> }
                        { this.state.tweets.map(
                          (tweet, index) => 
                            <Tweet key={tweet._id} conteudo={tweet.conteudo} tweetInfo={tweet}  /> 
                          )
                        }                        
                    </div>
                </Widget>
            </Dashboard>
        </div>
      </Fragment>
    );
  }
}

export default App;
