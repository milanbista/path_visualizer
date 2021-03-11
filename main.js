const canvas = document.querySelector('canvas')
const visualize = document.querySelector('.visualize')
const resetPath = document.querySelector(".reset_path")
const resetGrid = document.querySelector(".reset_everything")
canvas.height = 600
canvas.width = 600
canvas.style.border='1px solid black'
const c = canvas.getContext('2d')

const row= 30
const col = 30
var boxes =[]
var open_list = []
var closed_list = new Set()
var counter = 0

class Box {
    constructor(x_position,y_position) {
        this.x_position = x_position
        this.y_position = y_position
        this.neighbors = []
        this.isStart = false
        this.isEnd = false
        this.parent = null  
        this.isBarrier = false       
    }
}

function create_grid(){
    for (let i = 0; i< row; i++){
        boxes[i] = []
        for(let j =0; j< col; j++){
            boxes[i][j] = new Box(i*canvas.height/row, j*canvas.width/col)
            c.beginPath()
            c.rect(i*canvas.height/row, j*canvas.width/col, 20,20)
            c.strokeStyle ="rgb(174,177,181)"
            c.fillStyle="white"
            c.fill()
            c.stroke()

        }
    }
}


function get_neighbors(){
    for (let i = 0; i< row; i++){
        for(let j =0; j< col; j++){
            //check up
            if((i > 0 )&& (!boxes[i-1][j].isBarrier)){
                boxes[i][j].neighbors.push(boxes[i-1][j])
            }

            //check bottom
            if((i < (row-1) )&& (!boxes[i+1][j].isBarrier)){
                boxes[i][j].neighbors.push(boxes[i+1][j])
            }

            //check right

            if((j < (col-1)) && (!boxes[i][j+1].isBarrier )){
                boxes[i][j].neighbors.push(boxes[i][j+1])

            }
            //check left
            if(j > 0 && !boxes[i][j-1].isBarrier){
                boxes[i][j].neighbors.push(boxes[i][j-1])
            }

        }
    }

}


  start_animation = ()=>{

    var interval = setInterval( async() => {
    if(open_list.length > 0){
        let item = open_list[0]
        closed_list.add(item)
        const a = await open_list.shift()
        check_each_neighbors(item)
            
        if(item == end_node){
            console.log("Found The Target!! ")
            //sending end_node.parent so 
            //yellow path doesnot overwrite the end node
            draw_path(end_node.parent)
            clearInterval(interval)
        }  
        color_box(item)
        
    }
    else{
        clearInterval(interval)
    }

        
    }, 1);
    
    
}


function draw_path(current_node){   
    if(current_node == start_node){
        return
    }
    color_node(current_node, 'yellow')
    draw_path(current_node.parent)

}




// this function is to check the neighbors of 
// open list node its expanding 
function check_each_neighbors(obj){
    for(let i =0; i< obj.neighbors.length; i++){
        if(!closed_list.has(obj.neighbors[i])){ 
            var is_already_in_open = false
            for( let k =0; k< open_list.length; k++){
                if(open_list[k] == obj.neighbors[i]){
                    is_already_in_open = true
                }
            }
            if(!is_already_in_open){
                obj.neighbors[i].parent = obj
                open_list.push(obj.neighbors[i])            
            }
        }
    }
}


function color_box(item){
    if(item.isStart == false && item.isEnd == false){
    c.beginPath()
    c.rect(item.x_position, item.y_position, 20,20)
    c.fillStyle='rgb(64,206,227)'
    c.fill()
    c.stroke() 
    }
}

function color_node(item, color){
    c.beginPath()
    c.rect(item.x_position, item.y_position, 20,20)
    c.fillStyle=color
    c.fill()
    c.stroke() 
}


function reset_grids_path(){
    open_list =[]
    closed_list.clear()
    for ( var i = 0; i< row; i++){
        for (var j=0; j< col; j++){
            if((!boxes[i][j].isBarrier) && (!boxes[i][j].isStart) && (!boxes[i][j].isEnd)){
                     boxes[i][j].neighbors = []
                     boxes[i][j].parent = null
                     color_node(boxes[i][j], 'white')
                }
        }
    }
}

function reset_everything(){
    open_list =[]
    closed_list.clear()
    for ( var i = 0; i< row; i++){
        for (var j=0; j< col; j++){
            if((boxes[i][j].isBarrier) || ((!boxes[i][j].isStart) && (!boxes[i][j].isEnd))){
                boxes[i][j].isBarrier = false
                boxes[i][j].neighbors = []
                boxes[i][j].parent = null
                color_node(boxes[i][j], 'white')
           }
        }
    }
}


create_grid()
// get_neighbors()

const start_node = boxes[3][15]
const end_node = boxes[25][1]
start_node.isStart = true
end_node.isEnd = true

color_node(start_node, 'red')

color_node(end_node, 'blue')



canvas.addEventListener('mousedown', (e)=>{

    console.log("mouse down working")

    canvas.onmousemove = (e)=>{
        console.log("mouse move working")
            var block_i = Math.floor(e.offsetX/20)
            var block_j = Math.floor(e.offsetY/20)
            console.log(block_i, block_j)
        
            if(!boxes[block_i][block_j].isStart && !boxes[block_i][block_j].isEnd){
                boxes[block_i][block_j].isBarrier = true
                color_node(boxes[block_i][block_j], 'black')
            }

    }
})

canvas.addEventListener("mouseup", (e)=>{
    canvas.onmousemove = null
})

canvas.addEventListener('click', (e)=>{

    console.log("clicked")
    var block_i = Math.floor(e.offsetX/20)
           var block_j = Math.floor(e.offsetY/20)
            console.log(block_i, block_j)
        
            if(!boxes[block_i][block_j].isStart && !boxes[block_i][block_j].isEnd){

            boxes[block_i][block_j].isBarrier = true
             color_node(boxes[block_i][block_j], 'black')
            }
})


visualize.addEventListener('click', async ()=>{
    reset_grids_path()
    open_list[0] = start_node
    get_neighbors()
    start_animation()
    console.log('clicked')
})


resetPath.addEventListener('click', reset_grids_path)

resetGrid.addEventListener('click', reset_everything)














