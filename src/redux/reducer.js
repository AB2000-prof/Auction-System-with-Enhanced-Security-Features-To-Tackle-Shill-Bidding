import {combineReducers} from 'redux';

//redux reducer to save product details in redux state
const setCurrentProduct=(state={},action)=>{
    switch(action.type){
        case 'SETPRODUCT':
            return action.data
        default:
            return state    
    }
}


//Combine all reducers into one, In this case there is only one. But there can be more
const rootReducer=combineReducers({
    setCurrentProduct:setCurrentProduct,
   
})

export default rootReducer