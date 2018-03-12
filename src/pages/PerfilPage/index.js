import React, { Component } from 'react'

class PerfilPage extends Component {
    // Pega o :usuario
    // Acessa a api
    // Printa os dados por meio do estado
    
    render() {
        console.log(this.props.match.params)
        return (
            <div className="PerfilPage">
                Oi, tudo bom?
            </div>
        )   
    }
}

export default PerfilPage