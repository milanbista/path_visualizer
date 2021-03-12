const canvas = document.querySelector('canvas')
const visualize = document.querySelector('.visualize')
const resetPath = document.querySelector(".reset_path")
const resetGrid = document.querySelector(".reset_everything")

canvas.width = 1440 
canvas.height = 600
const ROWS = 25 
const COLUMNS = 60
canvas.style.border='1px solid black'
const c = canvas.getContext('2d')

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
    console.log("grid called")
    for (var i = 0; i<ROWS; i++){
        boxes[i] = []
        for(var j=0; j<COLUMNS; j++){
            boxes[i][j] = new Box( j*(canvas.width/COLUMNS),i*(canvas.height/ROWS))
            c.beginPath()
            c.rect(j*(canvas.height/ROWS), i*(canvas.width/COLUMNS),25,25)
            c.strokeStyle ="rgb(14,177,181, 0.6)"
            c.fillStyle="white"
            c.fill()
            c.stroke()      

        }
    }
}

function color_node(item, color){

    if(!(item.isStart || item.isEnd)){
    c.beginPath()
    c.rect(item.x_position, item.y_position, 25,25)
    c.strokeStyle ="rgb(14,177,181, 0.6)"
    c.fillStyle = color
    c.fill()
    c.stroke()
    }
}


function get_neighbors(){
    for (let i = 0; i< ROWS; i++){
        for(let j =0; j< COLUMNS; j++){
            //check up
            if((i > 0 )&& (!boxes[i-1][j].isBarrier)){
                boxes[i][j].neighbors.push(boxes[i-1][j])
            }

             //check right
             if((j < (COLUMNS-1)) && (!boxes[i][j+1].isBarrier )){
                boxes[i][j].neighbors.push(boxes[i][j+1])

            }

            //check bottom
            if((i < (ROWS-1) )&& (!boxes[i+1][j].isBarrier)){
                boxes[i][j].neighbors.push(boxes[i+1][j])
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
        color_node(item, 'rgb(35, 218, 218)')
        
    }
    else{
        clearInterval(interval)
    }

        
    }, 1);
    
    
}


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


function draw_path(current_node){  
    setTimeout(() => {
        console.log("its runnign")
        if(current_node == start_node){
            return
        }
        color_node(current_node, 'yellow')
        draw_path(current_node.parent)
    }, 20); 
    

}



function reset_grids_path(){
    open_list =[]
    closed_list.clear()
    for ( var i = 0; i< ROWS; i++){
        for (var j=0; j< COLUMNS; j++){
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
    for ( var i = 0; i< ROWS; i++){
        for (var j=0; j< COLUMNS; j++){
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


const start_node = boxes[13][10]
// color_node(start_node, 'green')
start_node.isStart = true
c.beginPath()
c.moveTo(start_node.x_position+2, start_node.y_position+12.5)
c.lineTo(start_node.x_position+12.5, start_node.y_position+12.5)
c.strokeStyle='black'
c.lineWidth=4
c.stroke()
c.beginPath()
c.moveTo(start_node.x_position+12.5, start_node.y_position+3)
c.lineTo(start_node.x_position+22, start_node.y_position+12.5)
c.strokeStyle='black'
c.lineWidth=4
c.stroke()
c.beginPath()
c.moveTo(start_node.x_position+22, start_node.y_position+12.5)
c.lineTo(start_node.x_position+12.5, start_node.y_position+22)
c.strokeStyle='black'
c.lineWidth=4
c.stroke()






const end_node = boxes[13][45]
c.beginPath()
c.arc(end_node.x_position + 12.5, end_node.y_position+12.5, 10, 0, 2*Math.PI)
c.fillStyle='white'
c.strokeStyle = 'black'
c.lineWidth= 2
c.fill()
c.stroke()
c.beginPath()
c.arc(end_node.x_position + 12.5, end_node.y_position+12.5, 4, 0, 2*Math.PI)
c.fillStyle='red'
c.strokeStyle=''
c.fill()
c.stroke()
end_node.isEnd = true




canvas.addEventListener('mousedown', ()=>{

    console.log("mouse down working")

    canvas.onmousemove = (e)=>{
        console.log("mouse move working")
        console.log(e.offsetX, e.offsetY)
            var block_j = Math.floor(e.offsetX/24)
            var block_i = Math.floor(e.offsetY/24)
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

    console.log('offset x, y => ', e.offsetX, e.offsetY)
    var block_i = Math.floor(e.offsetY/24)
    var block_j = Math.floor(e.offsetX/24)
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
})



resetPath.addEventListener('click', reset_grids_path)

resetGrid.addEventListener('click', reset_everything)
