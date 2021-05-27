
//redux action to save product details in redux state
const setCurrentProduct = (data)=>{
    return{
        type:'SETPRODUCT',
        data:data
    }
}


export {setCurrentProduct}