export const addColor = (colorRGB,height)=>{
    return {
        type:'ADD_COLOR',
        payload:{
            colorRGB:colorRGB,
            height:height
        }
    }
}

export const removeColor = (id)=>{
    return {
        type:'REMOVE_COLOR',
        payload:id
    }
}

export const changeColorHeight = (id,value) =>{
    return {
        type:'CHANGE_COLOR_HEIGHT',
        payload:{
            id:id,
            value:value
        }
    }
}

export const changeColor = (id,value) =>{
    return {
        type:'CHANGE_COLOR',
        payload:{
            id:id,
            value:value
        }
    }
}

export const resetColors = () =>{
    return {
        type:'RESET_COLORS'
    }
}

export const sortByValue = ()=>{
    return { type:"SORT_BY_VALUE"}
}