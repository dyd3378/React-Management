import React from "react";

class CustomerDelete extends React.Component {
    deleteCustomer (id){
        const url = '/api/customers/' + id;
        fetch(url, {
            method: 'DELETE'
        }).then(this.props.stateRefresh());
        console.log("111");
        
        console.log("222");
        
    }
    render(){
        return(
            <button onClick={(e) => {this.deleteCustomer(this.props.id)}}>삭제</button>
        )
    }
}

export default CustomerDelete;